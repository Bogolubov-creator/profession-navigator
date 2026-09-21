import fs from 'node:fs';
import path from 'node:path';
import {all,one,run,unpack,privateDir,root} from '../server/db.js';
const selectedSources=new Set(['SRC-002','SRC-015','SRC-006','SRC-024','SRC-016','SRC-023','SRC-039','SRC-040','SRC-052','SRC-053','SRC-054','SRC-055','SRC-056','SRC-057','SRC-058','SRC-060','SRC-061','SRC-064','SRC-065']);
const links=[['GD-A-01','SRC-039','Р13014'],['GD-A-03','SRC-040','Р34001'],['LOG-A-01','SRC-054','акт'],['LOG-A-01','SRC-057','претензи'],['LOG-A-02','SRC-052','акт'],['LOG-A-03','SRC-053','акт']];
for(const row of all('SELECT * FROM materials')){
 const m=unpack(row);if(!selectedSources.has(m.sourceId)||!['card','question','form','service'].includes(m.kind))continue;
 // Одноразовое разрешение стартовой выборки; не отменяет последующие решения редактора.
 if(row.revision!==1)continue;
 if(m.kind==='service'&&!m.url)continue;
 m.status='published';m.revision=2;
 for(const [code,file,keyword] of links)if(m.code===code){m.attachments.push(file);const step=m.steps.find(s=>s.text.toLowerCase().includes(keyword.toLowerCase()));if(step)step.attachments.push(file);run('INSERT OR IGNORE INTO relations VALUES(?,?,?,?,?)',m.id+'-'+file,m.id,file+'-file',file,JSON.stringify({source:m.sourceId,reason:'Форма сопоставлена с упоминанием в тексте шага, а не с именем вложения'}));}
 run('UPDATE materials SET status=?,revision=?,data=? WHERE id=?',m.status,m.revision,JSON.stringify(m),m.id);run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,?,?,?,?)',m.id,m.revision,'initial-content-selection',new Date().toISOString(),JSON.stringify(m));
}
const out=path.join(root,'public/release');fs.mkdirSync(out,{recursive:true});
const items=all("SELECT * FROM materials WHERE status='published'").map(unpack).map(m=>{const {editorNote,sourceSha,...safe}=m;return safe;});
const files={};for(const m of items.filter(m=>m.fileId)){
 const s=JSON.parse(one('SELECT data FROM sources WHERE id=?',m.fileId).data);
 if(!['form'].includes(s.kind))throw Error('Публичный оригинал вне разрешённых форм: '+s.id);
 const ext=path.extname(s.path);files[s.id]=ext;fs.mkdirSync(path.join(out,'files'),{recursive:true});fs.copyFileSync(path.join(privateDir,'handoff',s.path),path.join(out,'files',s.id+ext));
}
const ids=new Set(items.map(m=>m.id));const relations=all('SELECT * FROM relations').filter(r=>ids.has(r.origin)).map(({evidence,...r})=>({...r,target:ids.has(r.target)?r.target:null}));
const professions=all('SELECT data FROM professions').map(r=>{const {source_ids,...p}=JSON.parse(r.data);return p;});
fs.writeFileSync(path.join(out,'catalog.json'),JSON.stringify({generated:new Date().toISOString(),mode:'read-only',professions,materials:items,relations,files}));
console.log(JSON.stringify({published:items.length,forms:Object.keys(files).length,kinds:items.reduce((a,m)=>(a[m.kind]=(a[m.kind]||0)+1,a),{})}));
