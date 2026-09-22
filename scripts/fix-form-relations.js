import {db,one,all,run,unpack} from '../server/db.js';
db.exec('BEGIN');try{for(const [code,wrong,right] of [['LOG-A-02','SRC-052','SRC-053'],['LOG-A-03','SRC-053','SRC-052']]){
 const m=unpack(one('SELECT * FROM materials WHERE code=?',code));if(!m)throw Error(code);
 for(const r of all('SELECT * FROM relations WHERE origin=? AND target_code=?',m.id,wrong))run('UPDATE relations SET target=?,target_code=?,evidence=? WHERE id=?',right+'-file',right,JSON.stringify({reason:'Исправлено соответствие вида акта сценарию',date:'2026-09-22'}),r.id);
 if(!m.formBindingCorrected){m.attachments=m.attachments.map(x=>x===wrong?right:x);m.steps=m.steps.map(s=>s.attachments?.some(x=>[wrong,right].includes(x))?{...s,id:s.id+'-forms-20260922',attachments:s.attachments.map(x=>x===wrong?right:x)}:s);m.formBindingCorrected=true;m.revision++;run('UPDATE materials SET revision=?,data=? WHERE id=?',m.revision,JSON.stringify(m),m.id);run('INSERT INTO versions(material_id,revision,actor,created,data) VALUES(?,?,?,?,?)',m.id,m.revision,'form-binding-correction',new Date().toISOString(),JSON.stringify(m));}
}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
