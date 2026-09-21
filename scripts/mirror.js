import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {sanitizeRelease} from './public-access.js';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
execFileSync(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'build'],{cwd:root,env:{...process.env,MIRROR:'1',VITE_MIRROR:'1'},stdio:'inherit'});
fs.cpSync(path.join(root,'public/release'),path.join(root,'work/mirror'),{recursive:true});
fs.rmSync(path.join(root,'work/mirror/release'),{recursive:true,force:true});
fs.copyFileSync(path.join(root,'work/mirror/index.html'),path.join(root,'work/mirror/404.html'));
fs.writeFileSync(path.join(root,'work/mirror/.nojekyll'),'');

const catalogPath=path.join(root,'work/mirror/catalog.json');
const safe=sanitizeRelease(JSON.parse(fs.readFileSync(catalogPath,'utf8')));
fs.writeFileSync(catalogPath,JSON.stringify(safe));
const allowed=new Set(Object.entries(safe.files).map(([id,ext])=>id+ext));
for(const file of fs.readdirSync(path.join(root,'work/mirror/files')))if(!allowed.has(file))fs.rmSync(path.join(root,'work/mirror/files',file));
