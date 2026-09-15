const {spawnSync,spawn}=require('node:child_process');
const path=require('node:path');
const env={...process.env,NEXT_DIST_DIR:'.next-verify',APP_URL:'http://localhost:3100',DATABASE_PATH:path.join(process.cwd(),'.data','test-'+Date.now()+'.sqlite'),COOKIE_SECURE:'false',ADMIN_EMAILS:'staff@example.test',ADMIN_EMAIL:'staff@example.test',ADMIN_PASSWORD:'Test-staff-password-2026'};
const result=spawnSync(process.execPath,['scripts/create-admin.cjs'],{env,stdio:'inherit'});if(result.status)process.exit(result.status);
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3100'],{env,stdio:'inherit'});
process.on('SIGTERM',()=>server.kill());process.on('SIGINT',()=>server.kill());server.on('exit',code=>process.exit(code || 0));
