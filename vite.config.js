import {defineConfig} from 'vite';
export default defineConfig({base:'./',publicDir:false,build:{outDir:process.env.MIRROR?'work/mirror':'dist'}});
