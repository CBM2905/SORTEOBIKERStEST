import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET;
const WOMPI_INTEGRITY_KEY = process.env.WOMPI_INTEGRITY_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Generate unique 6-digit ticket numbers for approved transactions
 */
async function generateTickets(
  transactionId: number,
  customerId: number,
  itemsData: any[]
): Promise<void> {
  try {
    console.log('[Tickets] Generating tickets for transaction:', transactionId);

    // Check if tickets already exist
    const { data: existingTickets } = await supabase
      .from('tickets')
      .select('id')
      .eq('transaction_id', transactionId)
      .limit(1);

    if (existingTickets && existingTickets.length > 0) {
      console.log('[Tickets] Tickets already exist for this transaction, skipping');
      return;
    }

    const tickets: any[] = [];

    // Generate tickets for each item and quantity
    for (const item of itemsData) {
      const quantity = item.quantity || 1;
      
      for (let i = 0; i < quantity; i++) {
        const ticketNumber = await generateUniqueTicketNumber();
        
        tickets.push({
          ticket_number: ticketNumber,
          transaction_id: transactionId,
          customer_id: customerId,
          status: 'active',
          award_title: item.title || 'Premio',
          award_image: item.image || null,
        });
      }
    }

    // Insert all tickets at once
    const { data: insertedTickets, error: insertErr } = await supabase
      .from('tickets')
      .insert(tickets)
      .select();

    if (insertErr) {
      console.error('[Tickets] Error inserting tickets:', insertErr);
      return;
    }

    console.log(`[Tickets] Generated ${insertedTickets?.length || 0} tickets`);
  } catch (error) {
    console.error('[Tickets] Fatal error generating tickets:', error);
  }
}

/**
 * Generate a unique 6-digit ticket number
 */
async function generateUniqueTicketNumber(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Generate random 6-digit number
    const ticketNumber = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if it exists
    const { data: existing } = await supabase
      .from('tickets')
      .select('id')
      .eq('ticket_number', ticketNumber)
      .limit(1);

    if (!existing || existing.length === 0) {
      return ticketNumber;
    }

    attempts++;
  }

  // Fallback: use timestamp-based number
  const timestamp = Date.now().toString().slice(-6);
  return timestamp.padStart(6, '0');
}

export async function POST(request: Request) {
  try {
    console.log('[Webhook] hit at', new Date().toISOString());

    // Wompi suele enviar la firma en este header, pero por seguridad probamos variantes
    const signature =
      request.headers.get('X-Wompi-Signature') ||
      request.headers.get('x-wompi-signature') ||
      request.headers.get('X-Event-Signature') ||
      request.headers.get('x-event-signature') ||
      request.headers.get('X-Signature') ||
      request.headers.get('x-signature');

    // En sandbox Wompi puede enviar un checksum de evento
    const headerChecksum =
      request.headers.get('X-Event-Checksum') || request.headers.get('x-event-checksum');

    console.log('[Webhook] headers:', Object.fromEntries(request.headers));
    const raw = await request.text();

    console.log('[Webhook] body length:', raw.length);
    console.log('[Webhook] signature:', signature);

    if (!raw || !raw.trim()) {
      console.error('[Webhook] empty body');
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    if (!WOMPI_EVENTS_SECRET) {
      console.error('[Webhook] WOMPI_EVENTS_SECRET missing');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const expected = crypto.createHmac('sha256', WOMPI_EVENTS_SECRET).update(raw).digest('hex');
    let signatureVerified = false;

    // Parse JSON early to access body-level checksum
    let event;
    try {
      event = JSON.parse(raw);
    } catch (e) {
      console.error('[Webhook] invalid JSON:', e);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (signature && expected === signature) {
      signatureVerified = true;
      console.log('[Webhook] header signature verified');
    }

    // If Wompi provided checksum header, ensure it matches body checksum
    if (!signatureVerified && headerChecksum && event?.signature?.checksum) {
      if (headerChecksum === event.signature.checksum) {
        signatureVerified = true;
        console.log('[Webhook] header checksum matches body checksum');
      } else {
        console.error('[Webhook] header checksum mismatch', {
          headerChecksum,
          bodyChecksum: event?.signature?.checksum,
        });
      }
    }

    if (!signatureVerified) {
      const checksum = event?.signature?.checksum;
      const properties: string[] | undefined = event?.signature?.properties;

      if (checksum && Array.isArray(properties) && WOMPI_INTEGRITY_KEY) {
        const baseObj = event?.data ?? {};

        const resolvePath = (obj: any, path: string) => {
          return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
        };

        const values = properties.map((prop) => {
          const val = resolvePath(baseObj, prop);
          return val != null ? String(val) : '';
        });

        const toSign = values.join('') + WOMPI_INTEGRITY_KEY;
        const computed = crypto.createHash('sha256').update(toSign).digest('hex');

        if (computed === checksum) {
          signatureVerified = true;
          console.log('[Webhook] body checksum verified via Integrity Key');
        } else {
          console.error('[Webhook] checksum mismatch', { computed, checksum, properties, values });
        }
      } else {
        console.error('[Webhook] missing checksum/properties or integrity key', {
          haveChecksum: Boolean(event?.signature?.checksum),
          haveProperties: Array.isArray(event?.signature?.properties),
          haveIntegrityKey: Boolean(WOMPI_INTEGRITY_KEY),
        });
      }
    }

    if (!signatureVerified) {
      console.error('[Webhook] invalid signature', { expected, received: signature });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const tx = event?.data?.transaction;
    if (!tx?.status || !tx?.id) {
      console.error('[Webhook] missing transaction fields', tx);
      return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
    }
    const { status, id, amount_in_cents } = tx;
    const paymentLinkId: string | undefined = tx?.payment_link_id;

    // Try to extract our original 'order-...' reference from redirect_url
    let originalRef: string | undefined;
    const redirectUrl: string | undefined = tx?.redirect_url;
    if (redirectUrl) {
      try {
        const u = new URL(redirectUrl);
        originalRef = u.searchParams.get('reference') || undefined;
      } catch {}
    }

    console.log('[Webhook] transaction:', {
      tx_reference: tx?.reference,
      originalRef,
      paymentLinkId,
      status,
      id,
      amount_in_cents,
    });

    // Search order of preference: originalRef (our DB reference) -> paymentLinkId -> tx.reference
    let existingTx: any | null = null;
    let searchErr: any | null = null;

    if (originalRef) {
      const res = await supabase
        .from('transactions')
        .select('*')
        .eq('reference', originalRef)
        .single();
      existingTx = res.data;
      searchErr = res.error ?? null;
    }

    if (!existingTx && paymentLinkId) {
      const res2 = await supabase
        .from('transactions')
        .select('*')
        .eq('wompi_transaction_id', paymentLinkId)
        .single();
      existingTx = res2.data;
      searchErr = res2.error ?? searchErr;
    }

    if (!existingTx && tx?.reference) {
      const res3 = await supabase
        .from('transactions')
        .select('*')
        .eq('reference', tx.reference)
        .single();
      existingTx = res3.data;
      searchErr = res3.error ?? searchErr;
    }

    if (!existingTx) {
      console.error('[Webhook] transaction not found for update', {
        originalRef,
        paymentLinkId,
        tx_reference: tx?.reference,
        searchErr,
      });
      // Acknowledge to avoid retries; DB might be missing or pending creation
      return NextResponse.json({ received: true, note: 'Transaction not found; skipping update' });
    }

    const { data: updated, error: updErr } = await supabase
      .from('transactions')
      .update({
        status: status.toLowerCase(),
        wompi_transaction_id: id,
        webhook_received_at: new Date().toISOString(),
        webhook_data: event.data,
        metadata: {
          ...existingTx?.metadata,
          wompi_status: status,
          updated_at: new Date().toISOString(),
        },
      })
      .eq('id', existingTx.id)
      .select()
      .single();

    if (updErr) {
      console.error('[Webhook] update error:', updErr);
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }

    console.log('[Webhook] updated status ->', updated?.status);

    // Generate tickets if payment approved and no tickets exist yet
    if (status.toLowerCase() === 'approved' && updated) {
      await generateTickets(updated.id, updated.customer_id, updated.items_data);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] fatal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}