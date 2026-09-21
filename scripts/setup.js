import {randomBytes,scryptSync,randomUUID} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {one,run,privateDir} from '../server/db.js';
const credentials=[];
for(const [username,role] of [['reader','reader'],['reader2','reader'],['editor','editor'],['admin','admin']]){
 if(one('SELECT id FROM users WHERE username=?',username))continue;
 const password=randomBytes(18).toString('base64url'),salt=randomBytes(16).toString('hex');
 run('INSERT INTO users VALUES(?,?,?,?,?)',randomUUID(),username,role,salt,scryptSync(password,salt,64).toString('hex'));
 credentials.push({username,role,password});
}
if(credentials.length)fs.writeFileSync(path.join(privateDir,'credentials.json'),JSON.stringify(credentials,null,2),{mode:0o600});
console.log('Учётные записи готовы. Доступы: private/credentials.json (только локально).');
