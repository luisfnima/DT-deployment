import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-price",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tarifario.smart-telco.com'),
  title: "Tarifario Smart Telco - Dashboard Comercial",
  description: "Cotizador inteligente en tiempo real para asesores de call center. Compara planes de Yoigo, Orange y Vodafone.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Tarifario Smart Telco - Dashboard Comercial",
    description: "Cotizador inteligente en tiempo real para asesores de call center. Compara planes de Yoigo, Orange y Vodafone.",
    siteName: "Tarifario Smart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tarifario Smart Telco Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col bg-[#F4F7FB] text-[#0F172A]" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && (
          <Script id="register-sw" strategy="afterInteractive">
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered');
                  }).catch(function(err) {
                    console.log('SW registration failed', err);
                  });
                });
              }
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
