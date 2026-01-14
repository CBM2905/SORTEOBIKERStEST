import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    console.log('[GetTickets] Fetching tickets for reference:', reference);

    // Find transaction by reference
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('id, status')
      .eq('reference', reference)
      .single();

    if (txError || !transaction) {
      console.error('[GetTickets] Transaction not found:', txError);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Get tickets for this transaction
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .eq('transaction_id', transaction.id)
      .order('created_at', { ascending: true });

    if (ticketsError) {
      console.error('[GetTickets] Error fetching tickets:', ticketsError);
      return NextResponse.json({ error: 'Error fetching tickets' }, { status: 500 });
    }

    console.log(`[GetTickets] Found ${tickets?.length || 0} tickets`);

    return NextResponse.json({
      tickets: tickets || [],
      transactionStatus: transaction.status,
    });
  } catch (error) {
    console.error('[GetTickets] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
