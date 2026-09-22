import fs from 'node:fs';
import {db,one,run,root} from '../server/db.js';
import path from 'node:path';
const cards=JSON.parse(fs.readFileSync(path.join(root,'content/additional-cards-2026-09-22.json')));let inserted=0;
db.exec('BEGIN IMMEDIATE');
try{for(const card of cards){const id='editorial-'+card.code;if(one('SELECT id FROM materials WHERE id=?',id))continue;
const m={...card,id,kind:'card',status:'published',revision:1,legalStatus:'unverified',contentOrigin:'editorial',sourceName:'Редакционная инструкция от 22.09.2026',attachments:[],tags:[],blocks:[],steps:card.steps.map((text,i)=>({id:card.code+'-step-'+(i+1),text,attachments:[],branches:[]})),legalReview:{date:'2026-09-22',status:'scoped',issue:'Подготовлена инструкция с нормативными основаниями для описанного сценария.',sources:card.externalLinks}};
run('INSERT INTO materials VALUES(?,?,?,?,?,?,?,?)',id,null,card.code,card.profession,m.kind,m.status,m.revision,JSON.stringify(m));run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,?,?,?,?)',id,1,'legal-completion-2026-09-22',new Date().toISOString(),JSON.stringify(m));inserted++;
}db.exec('COMMIT');console.log(JSON.stringify({inserted}));}catch(e){db.exec('ROLLBACK');throw e;}
