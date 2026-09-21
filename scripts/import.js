import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {db,all,one,run,privateDir} from '../server/db.js';
const hash=s=>createHash('sha256').update(s).digest('hex');
const clean=s=>String(s||'').replace(/\u2014/g,'–').trim();
const text=b=>b.rows?b.rows.map(r=>r.join(' | ')).join('\n'):b.text||'';
const codeRE=/^((?:GD|LOG|PED|MED|SOT|ST|SMI|HR|NKO|RLT)-[AQ]-\d{2})[.\s:]/;
const fields={'Ситуация':'situation','Кому адресовано':'audience','Кому':'audience','Чья сторона':'side','Границы применения':'scope','Срочность':'urgency','Сроки':'deadlines','Шаги':'steps','Что подготовить':'documents','Чего не делать':'errors','Правовое основание':'norms','Правовые основания':'norms','Дата сверки норм':'sourceDate','Связанные вопросы гида':'relatedQuestions','Приложения':'attachments'};
export function performImport({dryRun=false}={}){
 const bundle=path.join(privateDir,'handoff');
 const manifest=JSON.parse(fs.readFileSync(path.join(bundle,'inventory/manifest.json')));
 const catalog=JSON.parse(fs.readFileSync(path.join(bundle,'inventory/catalog.json')));
 const content=new Map(fs.readFileSync(path.join(bundle,'inventory/content_sources.jsonl'),'utf8').trim().split('\n').map(l=>{const x=JSON.parse(l);return [x.source_id,x.blocks]}));
 const report={sources:manifest.length,blocks:0,added:0,unchanged:0,proposals:0,entities:0,shaErrors:[],outcomes:{},dryRun};
 for(const s of manifest){
 const p=path.resolve(bundle,s.path);if(!p.startsWith(bundle+path.sep)||fs.lstatSync(p).isSymbolicLink())throw Error('Недопустимый путь источника');
 if(hash(fs.readFileSync(p))!==s.sha256)report.shaErrors.push(s.id);
 if(!['.docx','.pdf','.md','.zip','.7z'].includes(path.extname(p).toLowerCase()))throw Error('Неподдерживаемый файл');
 if(fs.statSync(p).size>100*1024*1024)throw Error('Источник превышает 100 МБ');
 const old=one('SELECT sha FROM sources WHERE id=?',s.id);report[!old?'added':old.sha===s.sha256?'unchanged':'proposals']++;
 report.blocks+=(content.get(s.id)||[]).length;
 }
 if(report.shaErrors.length)throw Error('Несовпадение SHA-256: '+report.shaErrors.join(', '));
 if(dryRun)return report;
 db.exec('BEGIN');
 try{
 for(const p of catalog)run('INSERT OR IGNORE INTO professions VALUES(?,?)',p.id,JSON.stringify(p));
 for(const source of manifest){
 const old=one('SELECT sha FROM sources WHERE id=?',source.id);
 if(old){if(old.sha!==source.sha256)run('INSERT OR IGNORE INTO proposals VALUES(?,?,?)',source.id+'-'+source.sha256,source.id,JSON.stringify({previousSha:old.sha,newSource:source,blocks:content.get(source.id)}));continue;}
 const bs=content.get(source.id)||[], profession=catalog.find(p=>p.source_ids.includes(source.id))?.id||'general';
 run('INSERT INTO sources VALUES(?,?,?)',source.id,source.sha256,JSON.stringify({...source,block_count:bs.length}));
 const outcomes=new Map();
 const add=(suffix,kind,title,selected,extra={})=>{
 const id=source.id+'-'+suffix;
 if(one('SELECT id FROM materials WHERE id=?',id)){for(const b of selected)outcomes.set(b.locator,{outcome:'editorial_archive',reason:'Повтор заголовка или ID: ручное сопоставление с '+id});return null;}
 const item={id,sourceId:source.id,sourceName:path.basename(source.path),sourceSha:source.sha256,profession,kind,title:clean(title),code:'',status:'review',legalStatus:'unverified',legalDate:null,legalBasis:'',steps:[],tags:[],category:'',stage:'',attachments:[],blocks:selected.map(b=>({...b,text:b.text?clean(b.text):undefined})),...extra};
 run('INSERT INTO materials VALUES(?,?,?,?,?,?,1,?)',id,source.id,item.code,profession,kind,item.status,JSON.stringify(item));
 run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,1,?,?,?)',id,'import',new Date().toISOString(),JSON.stringify(item));
 for(const b of selected)outcomes.set(b.locator,{outcome:'entity',entity_id:id,reason:null});report.entities++;return item;
 };
 if(['assignment','version','filled_sample','archive'].includes(source.kind)){
 if(source.kind==='assignment'){
 for(const b of bs)if(b.rows)for(const row of b.rows){const code=row[0]?.trim();if(/^[A-Z]+-A-\d{2}$/.test(code))add('task-'+code,'task',row[1]||code,[b],{code,status:'draft'});}
 const ex=bs.findIndex(b=>/^5\.\s*Пример/.test(text(b)));
 if(ex>=0)add('example','example','Учебный пример: '+path.basename(source.path),bs.slice(ex),{status:'draft'});
 }
 for(const b of bs)if(!outcomes.has(b.locator))outcomes.set(b.locator,{outcome:'editorial_archive',reason:source.kind});
 }else if(['form','normative_source'].includes(source.kind)){
 const names={'SRC-065':'Р12003. Уведомление о начале процедуры реорганизации','SRC-062':'Приказ Минюста № 304 от 29.11.2022 с приложениями','SRC-063':'Приказ Минюста № 305 от 29.11.2022 с приложениями'};
 add('file',source.kind==='form'?'form':'norm',names[source.id]||path.basename(source.path),bs,{fileId:source.id});
 }else if(['SRC-007','SRC-030','SRC-032'].includes(source.id)){
 for(const b of bs)outcomes.set(b.locator,{outcome:'editorial_archive',reason:'Параллельная PDF-версия; основной DOCX сохранён отдельно'});
 }else if(['SRC-002','SRC-015','SRC-023','SRC-031'].includes(source.id)){
 const starts=[];
 for(let i=0;i<bs.length;i++){
 const m=clean(text(bs[i])).match(codeRE);if(!m)continue;
 const following=bs.slice(i+1).map(text).find(t=>t.trim())||'';if(/^Ситуация\s*:/.test(following))starts.push([i,m[1]]);
 }
 for(let k=0;k<starts.length;k++){
 const [start,code]=starts[k], end=starts[k+1]?.[0]??bs.length, selected=bs.slice(start,end), data={code};let field='intro';
 for(const b of selected.slice(1)){
 const t=clean(text(b));if(!t)continue;
 const key=Object.keys(fields).find(f=>t===f||t.startsWith(f+':'));
 if(key){field=fields[key];const value=t.slice(key.length).replace(/^:\s*/,'');data[field]=value?[value]:[];}
 else{if(!Array.isArray(data[field]))data[field]=[];data[field].push(t);}
 }
 const steps=(data.steps||[]).map((t,i)=>({id:'step-'+hash(code+'|'+t).slice(0,10),text:t,attachments:[],branches:[...t.matchAll(/(?:шагу|шаг)\s+(\d+)/gi)].map(m=>({label:'К шагу '+m[1],index:Number(m[1])-1}))}));
 for(const [f,v] of Object.entries(data))if(Array.isArray(v))data[f]=v.join('\n');
 const title=clean(text(bs[start])).replace(codeRE,'').trim()||data.situation||code;
 add(code,'card',title,selected,{...data,steps});
 }
 }else if(source.id==='SRC-035'){
 const starts=[];for(let i=0;i<bs.length;i++)if(/\?$/.test(clean(text(bs[i])))&&bs.slice(i+1,i+5).some(b=>/^Юр(?:идический)?\s*язык\s*:/i.test(clean(text(b)))))starts.push(i);
 for(let k=0;k<starts.length;k++){
 const start=starts[k],selected=bs.slice(start,starts[k+1]??bs.length);let legal=[],simple=[],mode='legal';
 for(const b of selected.slice(1)){let t=clean(text(b));if(/^Неюр\s*язык:/i.test(t))mode='simple';t=t.replace(/^(?:Неюр|Юр)\s*язык:\s*/i,'');if(t)(mode==='legal'?legal:simple).push(t);}
 add('q-'+hash(text(bs[start])).slice(0,12),'question',text(bs[start]),selected,{legal:legal.join('\n'),simple:simple.join('\n')});
 }
 }else if(source.id==='SRC-006'){
 for(let i=0;i<bs.length;i++)if(bs[i].rows?.some(r=>r.length===2)){
 const title=[...bs.slice(0,i)].reverse().find(b=>clean(b.text))?.text||'Вопрос общего гида';
 add('q-'+hash(title).slice(0,12),'question',title,[bs[i]],{legal:bs[i].rows.map(r=>r[0]).join('\n'),simple:bs[i].rows.map(r=>r[1]).join('\n')});
 }
 }else if(source.id==='SRC-003'){
 add('collection','form','Сборник форм генерального директора',bs,{fileId:source.id,editorNote:'Сборник содержит несколько форм. Разделение на отдельные файлы требует редактора; скачивается единый сборник.'});
 }else if(source.id==='SRC-016'){
 const starts=[];for(let i=0;i<bs.length;i++)if(/^\d+[.)]\s/.test(text(bs[i])))starts.push(i);
 for(let k=0;k<starts.length;k++){const selected=bs.slice(starts[k],starts[k+1]??bs.length),t=selected.map(text).join('\n');add('service-'+hash(text(selected[0])).slice(0,10),'service',text(selected[0]),selected,{url:(t.match(/https?:\/\/[^\s)]+/)||[])[0]||'',urlStatus:'unverified'});}
 }else{
 // Границы вопросов определяются заголовками; неоднозначная PDF-вёрстка остаётся на проверке.
 const expanded=bs.flatMap(b=>b.type==='page'?[{...b,text:clean(b.text)}]:[b]);
 if(expanded.some(b=>b.type==='page')){
 for(const b of expanded){const t=clean(text(b));if(!t)continue;add('page-'+hash(b.locator).slice(0,10),'guide',t.split('\n').filter(Boolean).slice(0,2).join(' ').slice(0,180),[b],{editorNote:'Фрагмент PDF по странице. Требуется сверить границы вопросов и две колонки по оригиналу.'});}
 }else{
 const starts=[];for(let i=0;i<bs.length;i++){const t=clean(text(bs[i]));if(t.length<280&&/\?$/.test(t))starts.push(i);}
 for(let k=0;k<starts.length;k++){const selected=bs.slice(starts[k],starts[k+1]??bs.length);if(selected.map(text).join('').length<text(selected[0]).length+40)continue;add('q-'+hash(text(selected[0])).slice(0,12),'question',text(selected[0]),selected,{editorNote:'Сверить границы и разделить регистры ответа по оригиналу.'});}
 }
 }
 for(const b of bs){const o=outcomes.get(b.locator)||{outcome:'manual_review',reason:clean(text(b))?'Оглавление, заголовок или нераспознанная граница: сверить с оригиналом':'Пустой блок'};report.outcomes[o.outcome]=(report.outcomes[o.outcome]||0)+1;run('INSERT INTO blocks VALUES(?,?,?,?,?,?,?)',source.id+':'+b.locator,source.id,b.locator,JSON.stringify(b),o.outcome,o.entity_id||null,o.reason||null);}
 }
 const items=all('SELECT * FROM materials').map(r=>JSON.parse(r.data));
 for(const item of items){const refs=new Set(JSON.stringify(item.blocks).match(/\b[A-Z]{2,4}-[AQ]-\d{2}\b/g)||[]);for(const code of refs){if(code===item.code)continue;const candidates=items.filter(x=>x.code===code&&x.kind==='card');run('INSERT OR IGNORE INTO relations VALUES(?,?,?,?,?)',hash(item.id+'|'+code),item.id,candidates.length===1?candidates[0].id:null,code,JSON.stringify({source:item.sourceId,reason:'Упоминание в исходном фрагменте; не доказательство наличия цели'}));}}
 run('INSERT INTO imports(created,data) VALUES(?,?)',new Date().toISOString(),JSON.stringify(report));db.exec('COMMIT');return report;
 }catch(e){db.exec('ROLLBACK');throw e;}
}
if(process.argv[1]===import.meta.filename)console.log(JSON.stringify(performImport({dryRun:process.argv.includes('--dry-run')}),null,2));
