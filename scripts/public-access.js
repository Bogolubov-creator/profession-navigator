// Вызывается и экспортом из базы, и статической сборкой. Закрытый текст не уходит в зеркало.
export function sanitizeRelease(data){
 const materials=data.materials.map(m=>m.accessLevel==='subscriber'?{id:m.id,title:m.title,code:m.code,profession:m.profession,kind:m.kind,status:m.status,accessLevel:'subscriber',locked:true,blocks:[],steps:[],attachments:[]}:m);
 const allowedFiles=new Set(materials.filter(m=>!m.locked&&m.fileId).map(m=>m.fileId));
 const files=Object.fromEntries(Object.entries(data.files||{}).filter(([id])=>allowedFiles.has(id)));
 const openIds=new Set(materials.filter(m=>!m.locked).map(m=>m.id));
 return {...data,materials,files,relations:(data.relations||[]).filter(r=>openIds.has(r.origin)).map(r=>({...r,target:openIds.has(r.target)?r.target:null}))};
}
