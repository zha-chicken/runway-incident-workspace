import {cpSync,existsSync} from 'node:fs';
import {loadEnvFile} from 'node:process';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const root=fileURLToPath(new URL('..',import.meta.url));
process.chdir(root);
if(existsSync('.env.local'))loadEnvFile('.env.local');
const server=resolve('.next/standalone/server.js');
if(!existsSync(server))throw new Error('Run npm run build before npm start.');
cpSync('.next/static','.next/standalone/.next/static',{recursive:true});
const child=spawn(process.execPath,['--use-env-proxy',server],{
  cwd:root,stdio:'inherit',
  env:{...process.env,HOSTNAME:process.env.RUNWAY_HOST||'127.0.0.1',PORT:process.env.PORT||'3000',
    DATABASE_PATH:resolve(process.env.DATABASE_PATH||'runtime/runway.sqlite')}
});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
