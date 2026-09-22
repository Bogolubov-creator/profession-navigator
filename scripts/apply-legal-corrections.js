import fs from 'node:fs';
import path from 'node:path';
import {backup} from 'node:sqlite';
import {db,one,run,unpack,root,privateDir} from '../server/db.js';
import {applyLegalCorrection} from '../shared/legal-corrections.js';
const patches=JSON.parse(fs.readFileSync(path.resolve(root,process.argv[2]||'content/legal-corrections-2026-09-22.json')));
const destination=path.join(privateDir,'backups');fs.mkdirSync(destination,{recursive:true,mode:0o700});
await backup(db,path.join(destination,'before-legal-audit-'+Date.now()+'.sqlite'));
let updated=0;
db.exec('BEGIN IMMEDIATE');
try{
 for(const patch of patches){
  const old=unpack(one('SELECT * FROM materials WHERE id=?',patch.materialId));
  if(!old)throw Error('Нет материала: '+patch.materialId);
  const next=applyLegalCorrection(old,patch);if(!next)continue;
  const data=JSON.stringify(next);
  run('UPDATE materials SET revision=?,data=? WHERE id=?',next.revision,data,next.id);
  run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,?,?,?,?)',next.id,next.revision,'legal-audit-2026-09-22',new Date().toISOString(),data);updated++;
 }
 db.exec('COMMIT');console.log(JSON.stringify({updated,total:patches.length}));
}catch(e){db.exec('ROLLBACK');throw e;}
