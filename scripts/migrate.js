const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigrations() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = value;
      }
    });
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes('[YOUR-PASSWORD]')) {
    console.error('ERROR: DATABASE_URL is not set or still contains [YOUR-PASSWORD].');
    console.error('Please configure your database password in .env.local or set DATABASE_URL.');
    console.error('Example: postgresql://postgres:YOUR_PASSWORD@db.aestqtbstvyhcpwkkyut.supabase.co:5432/postgres');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to Supabase PostgreSQL at db.aestqtbstvyhcpwkkyut.supabase.co:5432...');
    await client.connect();
    console.log('Successfully connected to database!\n');

    const migrationFiles = [
      '001_initial_schema.sql',
      '002_rls_policies.sql',
      '003_functions_triggers.sql',
      '004_seed_data.sql',
    ];

    const migrationsDir = path.join(__dirname, '../supabase/migrations');

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`Running migration: ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`✓ Completed: ${file}\n`);
      }
    }

    console.log('🎉 All Supabase migrations and initial seed data applied successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
