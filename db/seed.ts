import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/velabeam' });

  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schema);
    console.log('Schema applied successfully');
  } catch (e: any) {
    console.error('Seed error:', e.message);
  } finally {
    await pool.end();
  }
}

seed();
