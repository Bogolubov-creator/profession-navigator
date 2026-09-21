import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
execFileSync(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'build'],{cwd:root,env:{...process.env,MIRROR:'1',VITE_MIRROR:'1'},stdio:'inherit'});
fs.cpSync(path.join(root,'public/release'),path.join(root,'work/mirror'),{recursive:true});
fs.rmSync(path.join(root,'work/mirror/release'),{recursive:true,force:true});
fs.copyFileSync(path.join(root,'work/mirror/index.html'),path.join(root,'work/mirror/404.html'));
fs.writeFileSync(path.join(root,'work/mirror/.nojekyll'),'');
