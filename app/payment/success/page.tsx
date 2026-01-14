'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

interface Ticket {
  id: number;
  ticket_number: string;
  award_title: string;
  award_image?: string;
  status: string;
  created_at: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    if (!reference) return;

    const fetchTickets = async () => {
      try {
        setLoadingTickets(true);
        const response = await fetch(`/api/get-tickets?reference=${reference}`);
        const data = await response.json();
        
        if (data.tickets) {
          setTickets(data.tickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoadingTickets(false);
      }
    };

    // Fetch tickets initially, then retry after 2s if none found (webhook might still be processing)
    fetchTickets();
    
    const retryTimer = setTimeout(() => {
      if (tickets.length === 0) {
        fetchTickets();
      }
    }, 2000);

    return () => clearTimeout(retryTimer);
  }, [reference]);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="card-dark rounded-lg p-8 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gold">¡Pago Exitoso!</h1>
            <p className="text-muted text-lg mt-2">
              Tu pago ha sido procesado correctamente
            </p>
          </div>

          {reference && (
            <div className="bg-muted/10 rounded p-4 text-center">
              <p className="text-sm text-muted mb-1">Referencia de pago:</p>
              <p className="text-white font-mono text-sm break-all">{reference}</p>
            </div>
          )}

          {/* Tickets Section */}
          {loadingTickets ? (
            <div className="text-center py-8">
              <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted">Generando tus boletas...</p>
            </div>
          ) : tickets.length > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gold mb-2">Tus Boletas</h2>
                <p className="text-muted">Guarda estos números para el sorteo</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold rounded-lg p-6 text-center space-y-3"
                  >
                    {ticket.award_image && (
                      <div className="w-16 h-16 mx-auto mb-2 relative">
                        <img
                          src={ticket.award_image}
                          alt={ticket.award_title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted mb-1">{ticket.award_title}</p>
                      <p className="text-3xl font-bold text-gold font-mono tracking-wider">
                        {ticket.ticket_number}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gold/20">
                      <span className="text-xs text-green-400 font-semibold uppercase">
                        ✓ Activa
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-blue-300 text-sm">
                  📧 Recibirás un correo de confirmación con tus boletas y los detalles del sorteo.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                Tus boletas están siendo procesadas. Puedes verificar el estado de tu pago en la página de verificación.
              </p>
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/"
              className="inline-block btn-gold px-8 py-3 rounded font-semibold"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-gold text-xl">Cargando...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
