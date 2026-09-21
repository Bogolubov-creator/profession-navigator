import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {all,one,run,privateDir} from '../server/db.js';
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,12);
const content=new Map(fs.readFileSync(path.join(privateDir,'handoff/inventory/content_sources.jsonl'),'utf8').trim().split('\n').map(l=>{const x=JSON.parse(l);return[x.source_id,x.blocks]}));
const clean=t=>t.replace(/\u2014/g,'–').replace(/\u200b/g,'').trim();
function add(m){if(one('SELECT id FROM materials WHERE id=?',m.id))return;run('INSERT INTO materials VALUES(?,?,?,?,?,?,1,?)',m.id,m.sourceId,m.code||'',m.profession,m.kind,m.status,JSON.stringify(m));run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,1,?,?,?)',m.id,'structured-import',new Date().toISOString(),JSON.stringify(m));}
const fieldMap={'Ситуация':'situation','Кому адресовано':'audience','Кому':'audience','Срочность':'urgency','Шаги':'steps','Что подготовить':'documents','Чего не делать':'errors','Правовое основание':'norms','Дата сверки норм':'sourceDate','Связанные вопросы':'relatedQuestions','Связанные вопросы гида':'relatedQuestions','Приложения':'appendices'};
for(const sid of ['SRC-031','SRC-026']){
 const src=JSON.parse(one('SELECT data FROM sources WHERE id=?',sid).data),bs=content.get(sid),text=bs.map(b=>b.text||'').join('\n');
 const pattern=sid==='SRC-031'?/^ID карточки:\s*(PED-A-\d{2})(.*)$/gm:/^(SOT-A-\d{2})[.\s]+(.*)$/gm;
 const starts=[...text.matchAll(pattern)];
 for(let n=0;n<starts.length;n++){
 const match=starts[n],code=match[1],chunk=text.slice(match.index,starts[n+1]?.index??text.length),parts={};let field='intro';
 for(const raw of chunk.split('\n').slice(1)){const t=clean(raw);if(!t)continue;const key=Object.keys(fieldMap).find(k=>t===k||t.startsWith(k+':'));if(key){field=fieldMap[key];parts[field]=(parts[field]||'')+'\n'+t.slice(key.length).replace(/^:\s*/,'');}else parts[field]=(parts[field]||'')+'\n'+t;}
 let steps=[];
 if(sid==='SRC-026')steps=(parts.steps||'').split(/\n(?=\d+[.)]\s)/).map(clean).filter(Boolean);else steps=(parts.steps||'').split('\n').map(clean).filter(Boolean);
 const m={id:sid+'-'+code,sourceId:sid,sourceName:path.basename(src.path),sourceSha:src.sha256,code,profession:sid==='SRC-031'?'education':'occupational-safety',kind:'card',title:clean(match[2])||clean(parts.situation||code),status:'review',legalStatus:'unverified',legalDate:null,legalBasis:'',attachments:[],tags:[],blocks:[{locator:'code/'+code,type:'text',text:clean(chunk)}],...parts,steps:steps.map(t=>({id:'step-'+hash(code+t),text:t,attachments:[],branches:[...t.matchAll(/(?:шагу|шаг)\s+(\d+)/gi)].map(x=>({label:'К шагу '+x[1],index:Number(x[1])-1}))}))};add(m);
 }
 // Страницы PDF остаются в редакторском архиве, а отдельные карточки получают постоянные коды.
 if(sid==='SRC-026')run("UPDATE materials SET status='archived' WHERE source_id=? AND kind='guide'",sid);
}
for(const row of all("SELECT * FROM materials WHERE source_id='SRC-024' AND kind='question'")){
 if(row.revision!==1)continue;const m=JSON.parse(row.data),rows=m.blocks.flatMap(b=>b.rows||[]).filter(r=>r.length>=3);
 m.legal=rows.map(r=>r[0]).filter(Boolean).join('\n');m.simple=rows.map(r=>r.at(-1)).filter(Boolean).join('\n');run('UPDATE materials SET data=? WHERE id=?',JSON.stringify(m),m.id);
}
// Рабочая авторская фраза остаётся только в оригинале и архиве блоков.
for(const row of all("SELECT * FROM materials WHERE source_id='SRC-035'")){
 if(row.revision!==1)continue;const m=JSON.parse(row.data);if(!JSON.stringify(m).includes('хз как заменить'))continue;
 m.editorNote='Авторская пометка в body/79/paragraph. Простое объяснение требует редакторской переработки.';
 m.simple='';m.blocks=m.blocks.filter(b=>!JSON.stringify(b).includes('хз как заменить'));run('UPDATE materials SET data=? WHERE id=?',JSON.stringify(m),m.id);
 run("UPDATE blocks SET outcome='editorial_archive',reason='Авторская пометка; исключена из публикации' WHERE source_id='SRC-035' AND locator='body/79/paragraph'");
}
console.log('Структура педагогических карточек, охраны труда и двух колонок стартапера обработана.');
