import path from 'node:path';
export function documentExtension(name,bytes){
 if(typeof name!=='string'||name.length>180||/[\\/\0]/.test(name))throw Error('Недопустимое имя файла');
 const ext=path.extname(name).toLowerCase();
 if(ext==='.pdf'){if(bytes.subarray(0,5).toString()!=='%PDF-'||!bytes.subarray(-2048).includes(Buffer.from('%%EOF')))throw Error('Файл не является PDF');return ext}
 if(ext!=='.docx')throw Error('Загрузите PDF или DOCX');
 // Проверяем каталог ZIP без распаковки и выполнения содержимого документа.
 let end=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(bytes.readUInt32LE(i)===0x06054b50){end=i;break}
 if(end<0||bytes.readUInt16LE(end+4)||bytes.readUInt16LE(end+6))throw Error('Некорректный DOCX');
 const count=bytes.readUInt16LE(end+10),names=[];let offset=bytes.readUInt32LE(end+16);
 if(count>2000)throw Error('Слишком сложный DOCX');
 for(let n=0;n<count;n++){if(offset+46>end||bytes.readUInt32LE(offset)!==0x02014b50)throw Error('Некорректный каталог DOCX');const len=bytes.readUInt16LE(offset+28),extra=bytes.readUInt16LE(offset+30),comment=bytes.readUInt16LE(offset+32);if(offset+46+len+extra+comment>end)throw Error('Некорректный DOCX');const name=bytes.subarray(offset+46,offset+46+len).toString();if(name.includes('..')||/vbaProject|embeddings\//i.test(name)||bytes.readUInt16LE(offset+8)&1)throw Error('DOCX с вложенным или зашифрованным содержимым не поддерживается');names.push(name);offset+=46+len+extra+comment}
 if(!names.includes('[Content_Types].xml')||!names.includes('word/document.xml'))throw Error('Файл не является DOCX');return ext;
}
