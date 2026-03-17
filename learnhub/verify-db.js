const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function verify() {
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
    try {
        console.log('Connecting to database...');
        const result = await sql`SELECT NOW()`;
        console.log('Success! Database time:', result[0].now);
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await sql.end();
    }
}

verify();
