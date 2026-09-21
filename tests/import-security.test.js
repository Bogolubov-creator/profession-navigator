import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
test('Импорт отклоняет выход из каталога, ссылки и неподдерживаемые файлы',()=>{
 for(const mode of ['traversal','symlink','unsupported']){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'navigator-import-')),bundle=path.join(dir,'handoff');fs.mkdirSync(path.join(bundle,'inventory'),{recursive:true});
 const name=mode==='traversal'?'../outside.docx':mode==='unsupported'?'payload.exe':'link.docx';fs.writeFileSync(path.join(dir,'outside.docx'),'sample');if(mode==='symlink')fs.symlinkSync(path.join(dir,'outside.docx'),path.join(bundle,name));else if(mode==='unsupported')fs.writeFileSync(path.join(bundle,name),'sample');
 fs.writeFileSync(path.join(bundle,'inventory/manifest.json'),JSON.stringify([{id:'test',path:name,sha256:createHash('sha256').update('sample').digest('hex')}]));fs.writeFileSync(path.join(bundle,'inventory/catalog.json'),'[]');fs.writeFileSync(path.join(bundle,'inventory/content_sources.jsonl'),JSON.stringify({source_id:'test',blocks:[]}));
 assert.throws(()=>execFileSync(process.execPath,['scripts/import.js','--dry-run'],{cwd:root,env:{...process.env,DATA_DIR:dir},stdio:'pipe'}));fs.rmSync(dir,{recursive:true,force:true});
 }
});
