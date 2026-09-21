export const mirror=import.meta.env.VITE_MIRROR==='1';
let csrf='',data;
const normalize=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ').trim();
export async function api(url,options={}){
 if(mirror){
 data ||= await fetch('./catalog.json').then(r=>r.json());
 if(url==='/api/me')return {user:null};if(url==='/api/catalog')return data.professions;
 if(url.startsWith('/api/relations/'))return data.relations.filter(r=>r.origin===url.split('/').pop());
 if(url.startsWith('/api/materials/')){const m=data.materials.find(m=>m.id===url.split('/').pop());if(!m)throw Error('Материал не опубликован');return m;}
 if(url.startsWith('/api/materials')){const p=new URL(url,'http://local').searchParams,q=normalize(p.get('q'));let items=data.materials.filter(m=>!q||(q.match(/"[^"]+"|\S+/g)||[]).every(t=>normalize(JSON.stringify(m)+' '+data.professions.find(p=>p.id===m.profession)?.title).includes(t.replaceAll('"',''))));for(const k of ['profession','kind','status','side','urgency'])if(p.get(k))items=items.filter(m=>m[k]===p.get(k));items.sort((a,b)=>a.title.localeCompare(b.title,'ru')*(p.get('sort')==='desc'?-1:1));const page=Number(p.get('page'))||1,limit=Number(p.get('limit'))||24;return {total:items.length,items:items.slice((page-1)*limit,page*limit)};}
 throw Error('Эта функция доступна в полном серверном приложении');
 }
 const r=await fetch(url,{...options,headers:{'Content-Type':'application/json','X-CSRF-Token':csrf,...options.headers},body:options.body?JSON.stringify(options.body):undefined});const result=await r.json();if(!r.ok)throw Error(result.error||'Ошибка сервера');if(result.csrf)csrf=result.csrf;return result;
}
export const fileUrl=(id,download=false)=>mirror?`./files/${id}${data?.files?.[id]||''}`:`/files/${id}${download?'?download=1':''}`;
export const labels={card:'Что делать',question:'Вопрос гида',guide:'Фрагмент гида',form:'Документ',service:'Сервис',task:'Редакционное задание',example:'Учебный пример',norm:'Нормативный источник',draft:'Черновик',review:'Требует проверки',ready:'Готов к публикации',published:'Опубликован',archived:'В архиве'};
