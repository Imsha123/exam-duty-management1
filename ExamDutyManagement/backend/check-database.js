// Quick connection test:  npm run check:db
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
const env = { ...process.env };
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i !== -1) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

(async () => {
  console.log('Testing MySQL connection...\n');
  try {
    const conn = await mysql.createConnection({
      host: env.DB_HOST || 'localhost',
      port: parseInt(env.DB_PORT || '3306', 10),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
    const [v] = await conn.query('SELECT VERSION() AS version, DATABASE() AS db');
    console.log('Connected:', v[0]);
    const [t] = await conn.query('SHOW TABLES');
    console.log(`Tables found: ${t.length}`);
    t.forEach((r) => console.log(' -', Object.values(r)[0]));
    await conn.end();
  } catch (e) {
    console.error('Connection FAILED:', e.message);
    process.exit(1);
  }
})();
