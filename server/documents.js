import express from 'express';import fs from 'node:fs';import path from 'node:path';import {randomUUID,createHash} from 'node:crypto';
import {db,one,run,privateDir} from './db.js';
import {documentExtension} from '../shared/upload-validation.js';
export function registerDocuments(app,{editor}){
 app.post('/api/admin/documents',editor,express.raw({type:'application/octet-stream',limit:'10mb'}),(req,res)=>{
 const {name,profession,title}=req.query;if(typeof profession!=='string'||!one('SELECT id FROM professions WHERE id=?',profession))return res.status(400).json({error:'Выберите профессию'});
 if(typeof title!=='string'||!title.trim()||title.length>1000)return res.status(400).json({error:'Укажите название документа'});
 if(!Buffer.isBuffer(req.body)||!req.body.length)return res.status(400).json({error:'Выберите файл'});
 const ext=documentExtension(name,req.body),id=randomUUID(),sourceId='UPL-'+id,relative='uploads/'+id+ext,target=path.join(privateDir,'handoff',relative),sha=createHash('sha256').update(req.body).digest('hex');
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,req.body,{flag:'wx',mode:0o600});
 const source={id:sourceId,path:relative,originalName:name,sha256:sha,kind:'form',profession,uploadedBy:req.user.username};
 const m={id,revision:1,title:title.trim(),profession,kind:'form',status:'draft',accessLevel:'public',legalStatus:'unverified',sourceId,sourceName:name,fileId:sourceId,blocks:[],steps:[],attachments:[],contentOrigin:'uploaded',editorNote:'Документ загружен редактором. Оригинал сохранён.'};
 db.exec('BEGIN');try{run('INSERT INTO sources VALUES(?,?,?)',sourceId,sha,JSON.stringify(source));run('INSERT INTO materials VALUES(?,?,?,?,?,?,?,?)',id,sourceId,'',profession,'form','draft',1,JSON.stringify(m));run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,?,?,?,?)',id,1,req.user.username,new Date().toISOString(),JSON.stringify(m));db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');fs.rmSync(target);throw e}res.status(201).json(m);
 });
}
