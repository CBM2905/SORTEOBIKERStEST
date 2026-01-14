"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart, setCustomer, customer } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: customer.fullName || "",
    email: customer.email || "",
    phone: customer.phone || "",
    cedula: customer.cedula || "",
    cedulaType: customer.cedulaType || "CC",
    city: customer.city || "",
    address: customer.address || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    // Validar datos del cliente
    if (!formData.fullName || !formData.email || !formData.cedula) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Guardar datos del cliente en contexto
    setCustomer(formData);

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            ticketId: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: totalAmount,
          customer: formData,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse payment response:", parseError);
        console.error("Response text:", text);
        alert("Error: Invalid response from payment service");
        return;
      }

      if (response.ok && data.payment_link) {
        // Clear cart and redirect to payment
        clearCart();
        window.location.href = data.payment_link;
      } else {
        console.error("Payment creation failed:", data);
        alert(`Error: ${data.error || "Failed to create payment"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <div className="pt-24 px-4 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#0d0d0d] mb-4">
            <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse-status" />
            <span className="text-sm text-[#bdb7a0] font-semibold">No hay productos en el carrito</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Tu carrito está vacío</h1>
          <p className="text-[#bdb7a0] mb-6">Agrega boletas para continuar con el proceso de compra.</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b8860b] text-[#050505] shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-sm text-[#8f876b] uppercase tracking-[0.08em] font-semibold">Checkout seguro</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">Tu Carrito</h1>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1f1f1f] bg-[#0d0d0d]">
            <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse-status" />
            <span className="text-sm text-[#bdb7a0] font-semibold">Pagos cifrados y verificados</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 shadow-xl shadow-black/20"
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full sm:w-32 h-40 sm:h-28 object-cover rounded-xl border border-[#1f1f1f]"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                      <p className="text-sm text-[#bdb7a0] line-clamp-2">{item.description}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#bdb7a0] hover:text-red-400 transition-colors"
                      aria-label="Eliminar del carrito"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#d4af37]">
                        ${item.price.toLocaleString("es-CO")}
                      </span>
                      <span className="text-xs text-[#8f876b] font-semibold">COP</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded-full px-2 py-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-[#1f1f1f] text-white hover:border-[#d4af37]"
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span className="min-w-[2.5rem] text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-[#1f1f1f] text-white hover:border-[#d4af37]"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario y resumen */}
          <div className="space-y-6">
            {/* Información del cliente */}
            <div className="rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-6 shadow-xl shadow-black/20 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Información del Cliente</h2>
                <span className="text-xs text-[#8f876b]">Campos obligatorios *</span>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#d4af37]">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-white placeholder-[#6f684f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#d4af37]">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-white placeholder-[#6f684f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#d4af37]">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-white placeholder-[#6f684f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-[#d4af37]">
                    Tipo de ID *
                  </label>
                  <select
                    name="cedulaType"
                    value={formData.cedulaType}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                  >
                    <option value="CC">Cédula (CC)</option>
                    <option value="PA">Pasaporte</option>
                    <option value="CE">Cédula Extranjera</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-[#d4af37]">
                    Número *
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-white placeholder-[#6f684f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#d4af37]">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-white placeholder-[#6f684f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                  placeholder="Bogotá"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#d4af37]">
                  Dirección
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-white placeholder-[#6f684f] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                  placeholder="Calle 123 #45-67"
                  rows={2}
                />
              </div>
            </div>

            {/* Resumen de compra */}
            <div className="rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-6 shadow-xl shadow-black/20 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Resumen</h2>
                <span className="text-xs text-[#8f876b]">No se cobran comisiones</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[#bdb7a0]">
                  <span>Subtotal</span>
                  <span>${totalAmount.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-[#bdb7a0]">
                  <span>Impuestos</span>
                  <span>$0</span>
                </div>
              </div>
              <div className="border-t border-[#1f1f1f] pt-3 flex justify-between items-center">
                <span className="text-lg text-[#bdb7a0]">Total a pagar</span>
                <span className="text-3xl font-extrabold text-[#d4af37]">
                  ${totalAmount.toLocaleString("es-CO")}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b8860b] text-[#050505] shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 transition-all"
              >
                Proceder al pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
