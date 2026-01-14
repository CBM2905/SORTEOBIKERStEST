import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WOMPI_API_URL = process.env.NEXT_PUBLIC_WOMPI_ENV || 'https://sandbox.wompi.co';
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;

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

    console.log('Checking payment status for reference:', reference);

    // 1. Buscar en Supabase primero
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Error querying database:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (transaction) {
      console.log('Found transaction in database:', transaction);
      
      return NextResponse.json({
        status: transaction.status,
        message: `Pago ${transaction.status}`,
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          status: transaction.status,
          amount_in_cents: transaction.amount_in_cents,
          created_at: transaction.created_at,
          webhook_received_at: transaction.webhook_received_at,
        },
      });
    }

    // 2. Si no está en BD, consultar Wompi directamente
    console.log('Transaction not found in database, checking with Wompi');

    const response = await fetch(
      `${WOMPI_API_URL}/v1/transactions?reference=${reference}`,
      {
        headers: {
          Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Error checking payment with Wompi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Wompi transaction data:', data);

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({
        status: 'pending',
        message: 'Payment not found yet',
      });
    }

    const wompiTransaction = data.data[0];
    const status = wompiTransaction.status.toLowerCase();

    return NextResponse.json({
      status,
      message: `Pago ${status}`,
      transaction: {
        id: wompiTransaction.id,
        reference: wompiTransaction.reference,
        status,
        amount_in_cents: wompiTransaction.amount_in_cents,
      },
    });
  } catch (error) {
    console.error('Error checking payment:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error verifying payment' },
      { status: 500 }
    );
  }
}
