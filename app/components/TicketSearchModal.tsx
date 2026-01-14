'use client';

import { useState, FormEvent } from 'react';

interface Ticket {
  id: number;
  ticket_number: string;
  status: string;
  award_title: string;
  award_image?: string;
  created_at: string;
  transaction_reference: string;
  purchase_date: string;
}

interface TicketSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketSearchModal({ isOpen, onClose }: TicketSearchModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    setError('');
    setTickets([]);
    setSearched(false);

    try {
      const response = await fetch(`/api/search-tickets?email=${encodeURIComponent(email.trim())}`);
      const data = await response.json();

      setSearched(true);

      if (data.found && data.tickets) {
        setTickets(data.tickets);
        setCustomerName(data.customer?.name || '');
      } else {
        setError(data.message || 'No se encontraron boletas para este correo.');
      }
    } catch (err) {
      console.error('Error searching tickets:', err);
      setError('Error al buscar las boletas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setTickets([]);
    setError('');
    setSearched(false);
    setCustomerName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d0d] border-2 border-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#050505]">Consulta tus Números</h2>
          <button
            onClick={handleClose}
            className="text-[#050505] hover:text-[#1a1a1a] transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#bdb7a0] mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-3 bg-[#050505] border border-[#2a2a2a] rounded-lg text-white placeholder-[#4a4a4a] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-colors"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#050505] font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Buscando...
                  </span>
                ) : (
                  'Buscar mis boletas'
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          {searched && tickets.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{customerName}</h3>
                  <p className="text-sm text-[#8f876b]">{email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#d4af37]">{tickets.length}</p>
                  <p className="text-xs text-[#8f876b]">Boletas activas</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border-2 border-[#d4af37] rounded-lg p-4 space-y-3"
                  >
                    {ticket.award_image && (
                      <div className="w-12 h-12 mx-auto relative">
                        <img
                          src={ticket.award_image}
                          alt={ticket.award_title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-xs text-[#bdb7a0] mb-1">{ticket.award_title}</p>
                      <p className="text-3xl font-bold text-[#d4af37] font-mono tracking-wider">
                        {ticket.ticket_number}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#d4af37]/20 text-center">
                      <span className="text-xs text-green-400 font-semibold uppercase">
                        ✓ Activa
                      </span>
                    </div>
                    <div className="text-xs text-[#8f876b] text-center">
                      {new Date(ticket.purchase_date).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm text-center">
                  💡 Guarda estos números. Recibirás notificaciones por correo sobre el sorteo.
                </p>
              </div>
            </div>
          )}

          {/* No Results */}
          {searched && tickets.length === 0 && !error && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎫</div>
              <p className="text-[#bdb7a0] text-lg">No se encontraron boletas activas</p>
              <p className="text-sm text-[#8f876b] mt-2">
                Asegúrate de usar el correo con el que realizaste la compra
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
