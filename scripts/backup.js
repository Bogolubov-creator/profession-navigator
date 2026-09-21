import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
const root=path.resolve(import.meta.dirname,'..'),dir=path.resolve(process.env.DATA_DIR||path.join(root,'private'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(p,x.name)):[path.join(p,x.name)]);
if(process.argv[2]==='restore'){
 const from=path.resolve(process.argv[3]||''),to=process.argv[4]&&path.resolve(process.argv[4]);if(!to||fs.existsSync(to))throw Error('Восстановление требует новый пустой путь: npm run restore -- backup-dir new-data-dir');
 const sums=JSON.parse(fs.readFileSync(path.join(from,'checksums.json')));for(const [p,sum] of Object.entries(sums))if(hash(path.join(from,p))!==sum)throw Error('Повреждена копия: '+p);
 fs.cpSync(from,to,{recursive:true});const db=new DatabaseSync(path.join(to,'navigator.sqlite'));if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('База повреждена');db.close();console.log('Восстановлено и проверено: '+to);
}else{
 const out=path.resolve(process.argv[2]||path.join(root,'work','backup-'+Date.now()));fs.mkdirSync(out,{recursive:true});
 const db=new DatabaseSync(path.join(dir,'navigator.sqlite'));db.prepare('VACUUM INTO ?').run(path.join(out,'navigator.sqlite'));db.close();
 fs.cpSync(path.join(dir,'handoff'),path.join(out,'handoff'),{recursive:true});
 const sums={};for(const p of walk(out))sums[path.relative(out,p)]=hash(p);fs.writeFileSync(path.join(out,'checksums.json'),JSON.stringify(sums,null,2));console.log('Копия: '+out);
}
