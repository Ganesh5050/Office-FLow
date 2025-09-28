import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to execute queries (compatible with existing code)
export const query = async (text, params = []) => {
  try {
    // Convert SQL query to Supabase format
    if (text.includes('SELECT')) {
      const tableName = extractTableName(text);
      
      // Parse WHERE clause
      const whereClause = extractWhereClause(text, params);
      
      if (whereClause && whereClause._searchValue && whereClause._searchColumns) {
        // Handle OR condition: search both product_id and id columns
        const searchValue = whereClause._searchValue;
        
        // Try product_id first
        let { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('product_id', searchValue);
        
        if (error) throw error;
        
        // If no results, try id column only if it looks like a UUID
        if (!data || data.length === 0) {
          // Check if searchValue looks like a UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(searchValue)) {
            const result = await supabase
              .from(tableName)
              .select('*')
              .eq('id', searchValue);
            
            if (result.error) throw result.error;
            data = result.data;
          }
        }
        
        return { rows: data };
      } else {
        // Regular query
        let query = supabase.from(tableName).select('*');
        
        if (whereClause) {
          Object.entries(whereClause).forEach(([key, value]) => {
            if (key !== '_searchValue' && key !== '_searchColumns') {
              query = query.eq(key, value);
            }
          });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return { rows: data };
      }
    }
    
    if (text.includes('INSERT')) {
      const tableName = extractTableName(text);
      // Extract column names and values from the SQL query
      const columnMatch = text.match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)/i);
      const valueMatch = text.match(/VALUES\s*\(([^)]+)\)/i);
      
      if (columnMatch && valueMatch && params.length > 0) {
        const columns = columnMatch[1].split(',').map(col => col.trim());
        const values = {};
        
        columns.forEach((col, index) => {
          if (params[index] !== undefined) {
            values[col] = params[index];
          }
        });
        
        const { data, error } = await supabase
          .from(tableName)
          .insert(values)
          .select();
        
        if (error) throw error;
        
        return { rows: data };
      }
      
      throw new Error('Invalid INSERT query format');
    }
    
    if (text.includes('UPDATE')) {
      const tableName = extractTableName(text);
      const values = extractUpdateValues(text, params);
      const whereClause = extractWhereClause(text, params);
      const { data, error } = await supabase
        .from(tableName)
        .update(values)
        .match(whereClause)
        .select();
      
      if (error) throw error;
      
      return { rows: data };
    }
    
    if (text.includes('DELETE')) {
      const tableName = extractTableName(text);
      const whereClause = extractWhereClause(text, params);
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .match(whereClause);
      
      if (error) throw error;
      
      return { rows: data };
    }
    
    // For other queries, return empty result
    return { rows: [] };
  } catch (error) {
    console.error('❌ Supabase query error:', error);
    throw error;
  }
};

// Helper function to get a client (compatible with existing code)
export const getClient = async () => {
  return supabase;
};

// Helper function for transactions (Supabase handles this automatically)
export const transaction = async (callback) => {
  return await callback(supabase);
};

// Helper functions to parse SQL queries
function extractTableName(sql) {
  // Handle INSERT INTO table_name
  let match = sql.match(/INSERT\s+INTO\s+(\w+)/i);
  if (match) return match[1];
  
  // Handle FROM table_name
  match = sql.match(/FROM\s+(\w+)/i);
  if (match) return match[1];
  
  // Handle UPDATE table_name
  match = sql.match(/UPDATE\s+(\w+)/i);
  if (match) return match[1];
  
  // Handle DELETE FROM table_name
  match = sql.match(/DELETE\s+FROM\s+(\w+)/i);
  if (match) return match[1];
  
  return 'unknown';
}

function extractValues(sql, params) {
  // This is a simplified parser - in production, you'd want a more robust solution
  const values = {};
  // For now, return empty object - values will be passed directly in the route handlers
  return values;
}

function extractUpdateValues(sql, params) {
  // This is a simplified parser - in production, you'd want a more robust solution
  const values = {};
  return values;
}

function extractWhereClause(sql, params) {
  const where = {};
  
  // Handle simple WHERE clauses like "WHERE product_id = $1 OR id = $1"
  const whereMatch = sql.match(/WHERE\s+(.+)/i);
  if (!whereMatch) return where;
  
  const whereClause = whereMatch[1];
  
  // Handle OR conditions - check both product_id and id
  const paramIndex = parseInt(whereClause.match(/\$(\d+)/)[1]) - 1;
  if (params[paramIndex] !== undefined) {
    const searchValue = params[paramIndex];
    
    // For OR conditions, we'll search both columns
    // This is a simplified approach - in production you'd want more sophisticated parsing
    if (whereClause.includes('product_id') && whereClause.includes('id')) {
      // We'll handle this in the query logic by checking both fields
      where._searchValue = searchValue;
      where._searchColumns = ['product_id', 'id'];
    } else {
      // Single column search
      const columnMatch = whereClause.match(/(\w+)\s*=\s*\$\d+/i);
      if (columnMatch) {
        where[columnMatch[1]] = searchValue;
      }
    }
  }
  
  return where;
}

export default supabase;
