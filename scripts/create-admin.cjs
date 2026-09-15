// Run in a trusted terminal with ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME set.
const Database = require('better-sqlite3');
const {randomUUID,randomBytes,scryptSync}=require('node:crypto');
const {mkdirSync}=require('node:fs');
const path=require('node:path');
const email=(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password=process.env.ADMIN_PASSWORD || '';
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length<12 || password.length>128) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12–128 characters).');
const file=process.env.DATABASE_PATH || path.join(process.cwd(),'.data','fablab.sqlite');mkdirSync(path.dirname(file),{recursive:true});const db=new Database(file);
db.exec('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TEXT NOT NULL)');
const salt=randomBytes(16).toString('hex'), hash=salt+':'+scryptSync(password,salt,64).toString('hex');
if(db.prepare('SELECT id FROM users WHERE email=?').get(email)) throw new Error('Account already exists. No changes made. Use the documented reset process if needed.');
db.prepare('INSERT INTO users VALUES (?,?,?,?,?)').run(randomUUID(),process.env.ADMIN_NAME || 'FabLab Staff',email,hash,new Date().toISOString());
db.close();console.log('Staff account created. Add its email to ADMIN_EMAILS in the server environment.');
