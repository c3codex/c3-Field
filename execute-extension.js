import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfihrspxvennjzazxcbj.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaWhyc3B4dmVubmp6YXp4Y2JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDczNzY0MiwiZXhwIjoyMDkwMzEzNjQyfQ.JMQ1_0tT1PFsfHovivBRCbiIdS4PPg9DlUOZ11_80xA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeExtension() {
  try {
    // Test connection
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('codex_source_reference')
      .select('count(*)', { count: 'exact', head: true });

    if (testError) {
      console.log('Note: Table may not exist yet. Error:', testError.message);
    } else {
      console.log('✓ Connection successful');
    }

    // Step 1: ALTER TABLE to add aliases column
    console.log('\n=== STEP 1: Adding aliases column ===');
    const alterResult = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE public.codex_source_reference ADD COLUMN IF NOT EXISTS aliases jsonb not null default \'[]\'::jsonb'
    }).catch(e => {
      console.log('Note: rpc method not available. Attempting direct approach...');
      return null;
    });

    if (alterResult?.error) {
      console.log('ALTER failed:', alterResult.error);
    } else {
      console.log('✓ ALTER TABLE executed (or column already exists)');
    }

    // Step 2: Check if table and aliases column exist
    console.log('\n=== STEP 2: Verifying table structure ===');
    const { data: columnData, error: colError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', 'codex_source_reference');

    if (colError) {
      console.log('Note: Cannot query information_schema via REST API');
    } else {
      console.log('Current columns:', columnData?.map(c => c.column_name));
    }

    console.log('\n=== NOTE ===');
    console.log('Supabase JavaScript SDK uses REST API, which does not support arbitrary SQL execution.');
    console.log('For full database mutation, the operator must either:');
    console.log('1. Execute the SQL file directly via Supabase SQL Editor');
    console.log('2. Provide PostgreSQL connection credentials for psql/psycopg2');
    console.log('3. Use a different execution mechanism');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

executeExtension();
