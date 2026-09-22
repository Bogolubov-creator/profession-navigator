import fs from 'node:fs';import path from 'node:path';import {syncFile} from '../scripts/sync-changes.js';import {parseSnapshot} from '../shared/changes.js';
export function registerChanges(app,{root,privateDir,editor}){
 const file=path.join(privateDir,'changes.json'),seed=path.join(root,'public/release/changes.json');if(!fs.existsSync(file))fs.copyFileSync(seed,file);let pending;
 const update=()=>pending||=(async()=>{try{return await syncFile(file)}finally{pending=null}})();
 app.get('/api/changes',(req,res)=>{try{res.json(parseSnapshot(JSON.parse(fs.readFileSync(file,'utf8'))))}catch{res.status(503).json({error:'Лента временно недоступна'})}});
 app.post('/api/admin/changes/sync',editor,async(req,res,next)=>{try{const data=await update();res.json({status:data.navigatorSync.status,items:data.items.length,lastPostAt:data.lastPostAt})}catch(e){next(e)}});
 if(process.env.CHANGES_AUTO_SYNC!=='0'){update().catch(()=>{});setInterval(()=>update().catch(()=>{}),60*60*1000).unref()}
}
