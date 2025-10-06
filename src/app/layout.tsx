import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "RogerBox - Transforma tu cuerpo cambiando tu mente",
  description: "Plataforma de fitness y bienestar con entrenamientos HIIT, planes nutricionales y mentoría personalizada. ¡Comienza tu transformación hoy!",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'RogerBox - Transforma tu cuerpo cambiando tu mente',
    description: 'Entrenamientos HIIT, planes nutricionales y mentoría personalizada. Únete a RogerBox.',
    url: 'https://rogerbox.vercel.app',
    siteName: 'RogerBox',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'RogerBox',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RogerBox - Transforma tu cuerpo cambiando tu mente',
    description: 'Entrenamientos HIIT, planes nutricionales y mentoría personalizada. Únete a RogerBox.',
    images: ['/logo.png'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
