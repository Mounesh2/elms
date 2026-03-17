const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function test() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set');
    return;
  }
  console.log('Testing connection to Supabase via postgres-js...');
  
  const sql = postgres(url, {
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await sql`SELECT 1 as connected`;
    console.log('Success!', result);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:');
    console.error(err);
    process.exit(1);
  }
}

test();
