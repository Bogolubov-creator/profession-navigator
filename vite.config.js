import {defineConfig} from 'vite';
export default defineConfig({base:'./',publicDir:'public/app',build:{outDir:process.env.MIRROR?'work/mirror':'dist'}});
