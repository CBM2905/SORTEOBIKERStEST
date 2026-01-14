import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorteo Bikers | Participa y Gana",
  description: "Participa en el sorteo oficial de la comunidad Bikers. Compra tu ticket y gana increíbles premios. Sorteos verificados y seguros.",
  keywords: "sorteo bikers,rifas motos,premios,comunidad bikers,sorteos online,rifas Colombia",
  authors: [{ name: "Sorteo Bikers" }],
  openGraph: {
    title: "Sorteo Bikers | Participa y Gana",
    description: "Participa en el sorteo oficial de la comunidad Bikers y gana increíbles premios.",
    url: "https://sorteo-bikers.com/",
    siteName: "Sorteo Bikers",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sorteo_bikers",
    creator: "@sorteo_bikers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
