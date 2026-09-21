import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual} from 'node:crypto';
import {db,all,one,run,unpack,materials,root,privateDir} from './db.js';
import {registerAccounts,canRead,preview,staff} from './accounts.js';
import {performImport} from '../scripts/import.js';
const app=express(), port=Number(process.env.PORT||4317), host=process.env.HOST||'127.0.0.1';
app.disable('x-powered-by');app.use(express.json({limit:'2mb'}));
app.use((req,res,next)=>{
 res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"});
 if(req.path.startsWith('/api')||req.path.startsWith('/files'))res.set('Cache-Control','no-store');
 const token=(req.headers.cookie||'').split('; ').find(s=>s.startsWith('sid='))?.slice(4);
 const session=token?one('SELECT * FROM sessions WHERE token=? AND expires>?',token,Date.now()):null;
 req.session=session;req.user=session?one('SELECT id,username,role FROM users WHERE id=?',session.user_id):null;
 if(!['GET','HEAD','OPTIONS'].includes(req.method)){
 const origin=req.headers.origin;if(origin&&origin!==`http://${req.headers.host}`&&origin!==`https://${req.headers.host}`)return res.status(403).json({error:'Недопустимый источник запроса'});
 if(req.path!=='/api/login'&&req.session&&req.headers['x-csrf-token']!==session.csrf)return res.status(403).json({error:'Требуется токен сессии'});
 }
 next();
});
const error=(res,n,s)=>res.status(n).json({error:s});
const auth=(req,res,next)=>req.user?next():error(res,401,'Войдите в свой профиль');
const editor=(req,res,next)=>['editor','admin'].includes(req.user?.role)?next():error(res,403,'Нужны права редактора');
const admin=(req,res,next)=>req.user?.role==='admin'?next():error(res,403,'Нужны права администратора');
const normalize=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ').trim();
const visible=(m,u)=>m&&(m.status==='published'||['editor','admin'].includes(u?.role));
const safePublic=m=>{const {editorNote,sourceSha, ...rest}=m;return rest;};
registerAccounts(app,{auth,admin});
const attempts=new Map();
app.post('/api/login',(req,res)=>{
 const key=req.ip, a=attempts.get(key)||{n:0,time:Date.now()};if(Date.now()-a.time>600000){a.n=0;a.time=Date.now();}if(a.n>=20)return error(res,429,'Слишком много попыток. Повторите через 10 минут');a.n++;attempts.set(key,a);
 const {username,password}=req.body;if(typeof username!=='string'||typeof password!=='string'||password.length>200)return error(res,400,'Проверьте поля входа');
 const u=one('SELECT * FROM users WHERE username=?',username);const derived=scryptSync(password,u?.salt||'missing',64);if(!u||!timingSafeEqual(derived,Buffer.from(u.hash,'hex')))return error(res,401,'Неверный логин или пароль');
 attempts.delete(key);const token=randomBytes(32).toString('hex'),csrf=randomBytes(24).toString('hex');run('INSERT INTO sessions VALUES(?,?,?,?)',token,u.id,csrf,Date.now()+86400000);
 res.cookie('sid',token,{httpOnly:true,sameSite:'strict',secure:process.env.COOKIE_SECURE==='1',maxAge:86400000,path:'/'});res.json({user:{id:u.id,username:u.username,role:u.role},csrf});
});
app.get('/api/me',(req,res)=>res.json({user:req.user,csrf:req.session?.csrf}));
app.post('/api/logout',auth,(req,res)=>{run('DELETE FROM sessions WHERE token=?',req.session.token);res.clearCookie('sid');res.json({ok:true});});
app.get('/api/catalog',(req,res)=>res.json(all('SELECT data FROM professions').map(r=>JSON.parse(r.data))));
app.get('/api/materials',(req,res)=>{
 let list=materials().filter(m=>req.query.admin==='1'&&['editor','admin'].includes(req.user?.role)||m.status==='published');
 const professionNames=Object.fromEntries(all('SELECT id,data FROM professions').map(r=>[r.id,JSON.parse(r.data).title]));
 const q=normalize(req.query.q);if(q){const terms=q.match(/"[^"]+"|\S+/g)||[];list=list.filter(m=>terms.every(t=>normalize(JSON.stringify(preview(m,req.user))+' '+professionNames[m.profession]).includes(t.replaceAll('"',''))));}
 for(const k of ['profession','kind','status','category','side','urgency'])if(req.query[k])list=list.filter(m=>m[k]===req.query[k]);
 list.sort((a,b)=>a.title.localeCompare(b.title,'ru')*(req.query.sort==='desc'?-1:1));const total=list.length,page=Math.max(1,Number(req.query.page)||1),limit=Math.min(1000,Math.max(1,Number(req.query.limit)||24));
 res.json({total,items:list.slice((page-1)*limit,page*limit).map(m=>staff(req.user)&&req.query.admin==='1'?m:preview(safePublic(m),req.user))});
});
app.get('/api/materials/:id',(req,res)=>{const m=unpack(one('SELECT * FROM materials WHERE id=?',req.params.id));if(!visible(m,req.user))return error(res,404,'Материал недоступен');if(!canRead(m,req.user))return res.status(402).json({error:'Материал доступен по подписке',locked:true,title:m.title});res.json(staff(req.user)?m:safePublic(m));});
app.get('/api/relations/:id',(req,res)=>{const m=unpack(one('SELECT * FROM materials WHERE id=?',req.params.id));if(!visible(m,req.user))return error(res,404,'Материал недоступен');if(!canRead(m,req.user))return error(res,402,'Материал доступен по подписке');res.json(all('SELECT * FROM relations WHERE origin=?',m.id).map(r=>{const target=unpack(one('SELECT * FROM materials WHERE id=?',r.target||''));return {...r,target:visible(target,req.user)?r.target:null};}));});
app.get('/files/:id',(req,res)=>{
 const row=one('SELECT data FROM sources WHERE id=?',req.params.id);if(!row)return error(res,404,'Файл не найден');const s=JSON.parse(row.data);
 const allowed=materials().some(m=>m.fileId===s.id&&m.status==='published'&&canRead(m,req.user));if(!allowed&&!['editor','admin'].includes(req.user?.role))return error(res,404,'Файл недоступен');
 const p=path.resolve(privateDir,'handoff',s.path),base=path.resolve(privateDir,'handoff');if(!p.startsWith(base+path.sep))return error(res,400,'Недопустимый путь');
 const name=path.basename(p);if(req.query.download==='1'||path.extname(p)!=='.pdf')res.download(p,name);else res.sendFile(p);
});
function validate(m){
 if(m.accessLevel&&!['public','subscriber'].includes(m.accessLevel))throw Error('Некорректный доступ');
 if(m.status==='published'&&m.sourceId){const src=one('SELECT data FROM sources WHERE id=?',m.sourceId);if(src&&['assignment','version','filled_sample','archive'].includes(JSON.parse(src.data).kind))throw Error('Этот источник предназначен только для редактора');}
 if(m.status==='published'&&JSON.stringify(m).includes('хз как заменить'))throw Error('Уберите рабочую авторскую пометку перед публикацией');
 if(m.code&&m.kind==='card'&&one("SELECT id FROM materials WHERE code=? AND kind='card' AND id<>? AND status<>'archived'",m.code,m.id))throw Error('Код карточки уже занят');
 if(typeof m.title!=='string'||!m.title.trim()||m.title.length>1000)throw Error('Нужен заголовок до 1000 символов');
 if(!['draft','review','ready','published','archived'].includes(m.status))throw Error('Некорректный статус');
 if(!['card','question','guide','form','service','task','example','norm'].includes(m.kind))throw Error('Некорректный тип');
 if(['task','example'].includes(m.kind)&&m.status==='published')throw Error('Задания и учебные примеры нельзя публиковать как ответы');
 if(!Array.isArray(m.steps)||m.steps.length>200)throw Error('Некорректные шаги');
 if(!Array.isArray(m.attachments)||!Array.isArray(m.blocks))throw Error('Вложения и блоки должны быть списками');
 if(new Set(m.steps.map(s=>s.id)).size!==m.steps.length)throw Error('ID шагов должны быть уникальны');
 for(const s of m.steps){if(typeof s.id!=='string'||typeof s.text!=='string'||!Array.isArray(s.attachments||[])||!Array.isArray(s.branches||[]))throw Error('Некорректный шаг');for(const b of s.branches||[])if(!Number.isInteger(b.index)||b.index<0||b.index>=m.steps.length)throw Error('Развилка ссылается на отсутствующий шаг');}
 if(m.url&&!/^https?:\/\//.test(m.url))throw Error('Допускаются только HTTP(S)-адреса');
 if(m.legalStatus==='verified'&&(!m.legalDate||!m.legalBasis))throw Error('Укажите дату и основание юридической проверки');
 for(const id of [m.fileId,...(m.attachments||[]),...m.steps.flatMap(s=>s.attachments||[])].filter(Boolean)){
 const source=one('SELECT data FROM sources WHERE id=?',id);if(!source)throw Error('Файл не существует: '+id);
 if(m.status==='published'&&['assignment','version','filled_sample','archive'].includes(JSON.parse(source.data).kind))throw Error('Редакторский оригинал нельзя публиковать');
 if(m.status==='published'&&id!==m.fileId&&!materials().some(x=>x.fileId===id&&x.status==='published'))throw Error('Сначала опубликуйте связанную форму: '+id);
 }
}
function save(m,actor){run('UPDATE materials SET code=?,profession=?,kind=?,status=?,revision=?,data=? WHERE id=?',m.code||'',m.profession||'',m.kind,m.status,m.revision,JSON.stringify(m),m.id);run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,?,?,?,?)',m.id,m.revision,actor,new Date().toISOString(),JSON.stringify(m));if(m.status==='published'){for(const u of all("SELECT DISTINCT user_id FROM personal WHERE item=? AND kind='favorite'",m.id))run('INSERT INTO notifications VALUES(?,?,?,0)',randomUUID(),u.user_id,JSON.stringify({title:'Обновлён материал: '+m.title,materialId:m.id,created:new Date().toISOString()}));}}
app.post('/api/admin/materials',editor,(req,res)=>{const m={title:'Новый материал',kind:'card',status:'draft',profession:'',legalStatus:'unverified',blocks:[],steps:[],attachments:[],...req.body,id:randomUUID(),revision:1};validate(m);run('INSERT INTO materials VALUES(?,?,?,?,?,?,?,?)',m.id,null,m.code||'',m.profession,m.kind,m.status,1,JSON.stringify(m));run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,?,?,?,?)',m.id,1,req.user.username,new Date().toISOString(),JSON.stringify(m));res.json(m);});
app.put('/api/admin/materials/:id',editor,(req,res)=>{
 const old=unpack(one('SELECT * FROM materials WHERE id=?',req.params.id));if(!old)return error(res,404,'Материал не найден');if(req.body.revision!==old.revision)return error(res,409,'Материал уже изменён другим редактором. Откройте актуальную версию, ваши правки остаются в форме.');
 const m={...old,...req.body,id:old.id,sourceId:old.sourceId,revision:old.revision+1};validate(m);db.exec('BEGIN');try{save(m,req.user.username);db.exec('COMMIT');res.json(m);}catch(e){db.exec('ROLLBACK');throw e;}
});
app.get('/api/admin/versions/:id',editor,(req,res)=>res.json(all('SELECT * FROM versions WHERE material_id=? ORDER BY revision DESC',req.params.id).map(r=>({...r,data:JSON.parse(r.data)}))));
app.post('/api/admin/restore/:id/:version',editor,(req,res)=>{const current=unpack(one('SELECT * FROM materials WHERE id=?',req.params.id));if(!current)return error(res,404,'Нет материала');if(req.body.revision!==current.revision)return error(res,409,'Конфликт версий');const v=one('SELECT data FROM versions WHERE material_id=? AND revision=?',req.params.id,Number(req.params.version));if(!v)return error(res,404,'Нет версии');const m={...JSON.parse(v.data),revision:current.revision+1,status:'review'};validate(m);save(m,req.user.username);res.json(m);});
app.get('/api/admin/sources',editor,(req,res)=>res.json(all('SELECT data FROM sources').map(r=>JSON.parse(r.data))));
app.get('/api/admin/sources/:id',editor,(req,res)=>res.json({source:JSON.parse(one('SELECT data FROM sources WHERE id=?',req.params.id)?.data||'null'),blocks:all('SELECT * FROM blocks WHERE source_id=?',req.params.id).map(r=>({...r,data:JSON.parse(r.data)}))}));
app.get('/api/admin/stats',editor,(req,res)=>res.json({statuses:all('SELECT status,COUNT(*) count FROM materials GROUP BY status'),outcomes:all('SELECT outcome,COUNT(*) count FROM blocks GROUP BY outcome'),sources:one('SELECT COUNT(*) count FROM sources').count,blocks:one('SELECT COUNT(*) count FROM blocks').count,unresolved:all('SELECT * FROM relations WHERE target IS NULL'),imports:all('SELECT * FROM imports ORDER BY id DESC LIMIT 10'),proposals:all('SELECT * FROM proposals')}));
app.post('/api/admin/import',admin,(req,res)=>res.json(performImport({dryRun:req.body.dryRun!==false})));
app.get('/api/admin/taxonomy',editor,(req,res)=>res.json(all('SELECT * FROM taxonomy').map(r=>JSON.parse(r.data))));
app.put('/api/admin/taxonomy/:id',editor,(req,res)=>{const d={...req.body,id:req.params.id};if(typeof d.title!=='string'||!d.title.trim())return error(res,400,'Нужно название');run('INSERT INTO taxonomy VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data',d.id,JSON.stringify(d));res.json(d);});
app.put('/api/admin/professions/:id',editor,(req,res)=>{const p=one('SELECT * FROM professions WHERE id=?',req.params.id);if(!p)return error(res,404,'Направление не найдено');const d={...JSON.parse(p.data),...req.body,id:p.id};run('UPDATE professions SET data=? WHERE id=?',JSON.stringify(d),p.id);res.json(d);});
app.get('/api/admin/users',admin,(req,res)=>res.json(all('SELECT id,username,role FROM users')));
app.put('/api/admin/users/:id',admin,(req,res)=>{if(!['reader','editor','admin'].includes(req.body.role))return error(res,400,'Неверная роль');if(req.params.id===req.user.id)return error(res,400,'Нельзя изменить собственную роль');run('UPDATE users SET role=? WHERE id=?',req.body.role,req.params.id);res.json({ok:true});});
app.get('/api/personal',auth,(req,res)=>{
 const items=all('SELECT * FROM personal WHERE user_id=?',req.user.id).map(r=>({...r,data:JSON.parse(r.data)}));
 const notices=all('SELECT * FROM notifications WHERE user_id=?',req.user.id).map(r=>({...r,...JSON.parse(r.data)}));
 for(const t of items.filter(x=>x.kind==='task'&&!x.data.done&&x.data.due&&x.data.due<=new Date().toISOString().slice(0,10))){const id='task-'+req.user.id+'-'+t.item;run('INSERT OR IGNORE INTO notifications VALUES(?,?,?,0)',id,req.user.id,JSON.stringify({title:'Срок личной задачи: '+t.data.title,created:new Date().toISOString()}));}
 res.json({items,notifications:all('SELECT * FROM notifications WHERE user_id=?',req.user.id).map(r=>({...r,...JSON.parse(r.data)}))});
});
app.put('/api/personal/:kind/:id',auth,(req,res)=>{const {kind,id}=req.params;if(!['progress','favorite','task'].includes(kind))return error(res,400,'Неверный тип');if(kind!=='task'){const m=unpack(one('SELECT * FROM materials WHERE id=?',id));if(!visible(m,req.user)||!canRead(m,req.user))return error(res,404,'Материал недоступен');if(kind==='progress'&&(!Array.isArray(req.body.done)||req.body.done.some(s=>!m.steps.some(x=>x.id===s))))return error(res,400,'Неизвестный шаг');}if(kind==='task'&&(typeof req.body.title!=='string'||!req.body.title.trim()))return error(res,400,'Введите задачу');run('INSERT INTO personal VALUES(?,?,?,?) ON CONFLICT(user_id,kind,item) DO UPDATE SET data=excluded.data',req.user.id,kind,id,JSON.stringify(req.body));res.json({ok:true});});
app.delete('/api/personal/:kind/:id',auth,(req,res)=>{run('DELETE FROM personal WHERE user_id=? AND kind=? AND item=?',req.user.id,req.params.kind,req.params.id);res.json({ok:true});});
app.put('/api/notifications/:id',auth,(req,res)=>{run('UPDATE notifications SET read=1 WHERE id=? AND user_id=?',req.params.id,req.user.id);res.json({ok:true});});
app.use('/api',(req,res)=>error(res,404,'API не найден'));
app.use(express.static(path.join(root,'dist')));
app.get('/{*path}',(req,res)=>res.sendFile(path.join(root,'dist/index.html')));
app.use((err,req,res,next)=>{res.status(err.status||400).json({error:err.type==='entity.too.large'?'Слишком большой запрос':err.message||'Ошибка обработки'});});
app.listen(port,host,()=>console.log(`Навигатор: http://${host}:${port}`));
