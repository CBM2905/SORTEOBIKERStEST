import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    console.log('[SearchTickets] Searching tickets for email:', email);

    // Find customer by email
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, full_name, email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (customerError || !customer) {
      console.log('[SearchTickets] Customer not found:', customerError);
      return NextResponse.json({
        found: false,
        message: 'No se encontraron boletas para este correo electrónico.',
      });
    }

    // Get all tickets for this customer with transaction info
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        *,
        transactions!inner(
          reference,
          status,
          amount_in_cents,
          created_at
        )
      `)
      .eq('customer_id', customer.id)
      .eq('transactions.status', 'approved')
      .order('created_at', { ascending: false });

    if (ticketsError) {
      console.error('[SearchTickets] Error fetching tickets:', ticketsError);
      return NextResponse.json({ error: 'Error fetching tickets' }, { status: 500 });
    }

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({
        found: false,
        message: 'No tienes boletas activas en este momento.',
      });
    }

    console.log(`[SearchTickets] Found ${tickets.length} tickets for customer ${customer.id}`);

    return NextResponse.json({
      found: true,
      customer: {
        name: customer.full_name,
        email: customer.email,
      },
      tickets: tickets.map((ticket: any) => ({
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        status: ticket.status,
        award_title: ticket.award_title,
        award_image: ticket.award_image,
        created_at: ticket.created_at,
        transaction_reference: ticket.transactions?.reference,
        purchase_date: ticket.transactions?.created_at,
      })),
      total: tickets.length,
    });
  } catch (error) {
    console.error('[SearchTickets] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
