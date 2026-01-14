import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const WOMPI_API_URL = process.env.NEXT_PUBLIC_WOMPI_ENV || 'https://sandbox.wompi.co';
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    const { items, totalAmount, customer } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !totalAmount || !customer) {
      console.error('Missing fields:', { items, totalAmount, customer });
      return NextResponse.json({ 
        error: 'Missing required fields',
      }, { status: 400 });
    }

    const { fullName, email, phone, cedula, cedulaType, city, address } = customer;

    if (!fullName || !email || !cedula) {
      return NextResponse.json({
        error: 'Missing required customer fields'
      }, { status: 400 });
    }

    // 1. Crear o actualizar cliente en Supabase
    let customerId;
    
    // Buscar cliente existente por email o cédula
    const { data: existingCustomers, error: searchError } = await supabase
      .from('customers')
      .select('id')
      .or(`email.eq.${email},cedula.eq.${cedula}`)
      .limit(1);

    if (searchError) {
      console.error('Error searching customer:', searchError);
    }

    if (existingCustomers && existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
      console.log('Using existing customer:', customerId);
      
      // Actualizar datos del cliente
      await supabase
        .from('customers')
        .update({
          full_name: fullName,
          email,
          phone: phone || null,
          cedula_type: cedulaType,
          city: city || null,
          address: address || null,
        })
        .eq('id', customerId);
    } else {
      // Crear nuevo cliente
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          full_name: fullName,
          email,
          phone: phone || null,
          cedula,
          cedula_type: cedulaType,
          city: city || null,
          address: address || null,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating customer:', createError);
        return NextResponse.json({
          error: 'Failed to create customer record'
        }, { status: 500 });
      }

      customerId = newCustomer.id;
      console.log('Created new customer:', customerId);
    }

    // Generate unique reference
    const reference = `order-${Date.now()}-${uuidv4()}`;
    
    // Create description with all items
    const description = items.map((item: any) => 
      `${item.title} x${item.quantity}`
    ).join(', ');
    
    console.log('Creating payment with:', { reference, totalAmount, email, description });

    // Create Wompi transaction link (simplified - just a payment link)
    const response = await fetch(`${WOMPI_API_URL}/v1/payment_links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Orden de compra`,
        description: description.substring(0, 255), // Limit description length
        single_use: false,
        collect_shipping: false,
        currency: 'COP',
        amount_in_cents: totalAmount * 100,
        reference: reference,
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/verification?reference=${reference}`,
      }),
    });

    const responseText = await response.text();
    
    console.log('Wompi response status:', response.status);
    console.log('Wompi response text:', responseText);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText) as { data: { id: string; permalink: string } };
    } catch (parseError) {
      console.error('Failed to parse Wompi response as JSON:', parseError);
      console.error('Response status:', response.status);
      console.error('Response text:', responseText);
      return NextResponse.json({ 
        error: 'Invalid response from payment gateway',
        status: response.status 
      }, { status: 502 });
    }

    console.log('Parsed Wompi data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Wompi API error:', data);
      return NextResponse.json({ error: 'Failed to create payment', details: data }, { status: 500 });
    }

    // Wompi returns the payment link ID, we need to construct the full URL
    const paymentLinkId = data.data?.id;
    
    if (!paymentLinkId) {
      console.error('Missing payment link ID in response. Full data:', data);
      return NextResponse.json({ error: 'No payment link ID in response', fullResponse: data }, { status: 500 });
    }

    // Construct the Wompi checkout URL
    const paymentLink = `https://checkout.wompi.co/l/${paymentLinkId}`;
    
    console.log('Payment link created:', paymentLink);

    // 2. Guardar transacción en Supabase
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        customer_id: customerId,
        reference,
        wompi_transaction_id: paymentLinkId,
        status: 'pending',
        amount_in_cents: totalAmount * 100,
        currency: 'COP',
        items_data: items,
        description: description.substring(0, 255),
        metadata: {
          payment_link: paymentLink,
          created_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error saving transaction to Supabase:', transactionError);
      // Continuar de todas formas porque el pago se creó en Wompi
    } else {
      console.log('Transaction saved:', transaction);
    }

    return NextResponse.json({ payment_link: paymentLink }, { status: 200 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}