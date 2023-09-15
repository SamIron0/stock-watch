import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

import { stripe } from './stripe';
import { toDateTime } from './helpers';

import { Stock } from 'types';
import type { Database } from 'types_db';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function createOrRetrieveStock(stock: Stock): Promise<Stock | null> {
  // Attempt to retrieve the stock from the supabase
  let { data, error } = await supabaseAdmin
    .from('stock')
    .select('*')
    .eq('id', stock.id)
    .single()

  // If there's an error or no stock exist, insert the stock  
  if (error || !data) {
    let { error } = await supabaseAdmin
      .from('stock')
      .insert([{
        id: stock.id,
      }]);

    //.insert(stock)
    // If there was an error inserting the stock, return null
    if (error) {
      console.error('There was an error inserting the stock:', error)
      return null
    }

    // If the insert was successful, select the inserted stock
    let { data: insertedStock, error: fetchError } = await supabaseAdmin
      .from('stock')
      .select('*')
      .eq('id', stock.id)
      .single()

    // If there was an error fetching the inserted stock, return null
    if (fetchError || !insertedStock) {
      console.error('There was an error fetching the inserted stock:', fetchError)
      return null
    }

    // If everything went fine, return the inserted stock
    return insertedStock
  }
  // If the stock was already present in the database, return it
  return data
}

export {
  createOrRetrieveStock,
};
