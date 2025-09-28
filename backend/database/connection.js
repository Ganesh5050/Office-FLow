// Database connection - supports both PostgreSQL and Supabase
import dotenv from 'dotenv';

dotenv.config();

// Check if using Supabase or PostgreSQL
const useSupabase = process.env.USE_SUPABASE === 'true' || process.env.SUPABASE_URL;

let query, getClient, transaction;

if (useSupabase) {
  console.log('🔗 Using Supabase database');
  const { query: supabaseQuery, getClient: supabaseGetClient, transaction: supabaseTransaction } = await import('./supabase.js');
  query = supabaseQuery;
  getClient = supabaseGetClient;
  transaction = supabaseTransaction;
} else {
  console.log('🔗 Using PostgreSQL database');
  const pkg = await import('pg');
  const { Pool } = pkg;

  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'officeflow',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  });

  // Test the connection
  pool.on('connect', () => {
    console.log('📊 Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
  });

  // Helper function to execute queries
  query = async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('🔍 Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('❌ Database query error:', error);
      throw error;
    }
  };

  // Helper function to get a client from the pool
  getClient = async () => {
    return await pool.connect();
  };

  // Helper function to execute a transaction
  transaction = async (callback) => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };
}

export { query, getClient, transaction };
export default { query, getClient, transaction };
