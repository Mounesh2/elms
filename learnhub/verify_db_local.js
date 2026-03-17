const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function verify() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }
  const client = postgres(process.env.DATABASE_URL);
  try {
    const coursesRes = await client`SELECT id, title, slug FROM courses WHERE slug IN ('sigma-web-development', 'delta-full-stack', 'dsa-in-c-kannada')`;
    console.log('--- Seeded Courses ---');
    console.table(coursesRes);

    const instructorsRes = await client`SELECT id, name, email FROM users WHERE id IN ('cwh-user-id-0001', 'apna-user-id-0002', 'algo-user-id-0003')`;
    console.log('--- Instructors ---');
    console.table(instructorsRes);

  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    process.exit(0);
  }
}

verify();
