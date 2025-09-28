import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { query } from '../database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Read the schema file
    const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await query(statement);
          console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          // Skip errors for statements that might already exist (like extensions)
          if (error.code === '42P07' || error.code === '42710') {
            console.log(`⚠️  Skipped statement ${i + 1} (already exists)`);
          } else {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log('✅ Database migration completed successfully!');
    console.log('\n📊 Database tables created:');
    console.log('- users (authentication)');
    console.log('- staff (staff directory)');
    console.log('- products (product registration)');
    console.log('- facilities (facility management)');
    console.log('- facility_bookings (booking system)');
    console.log('- documents (document archives)');
    console.log('- contact_messages (contact form)');
    console.log('- gallery (image gallery)');

  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().then(() => {
    console.log('🎉 Migration process completed!');
    process.exit(0);
  });
}

export default runMigrations;
