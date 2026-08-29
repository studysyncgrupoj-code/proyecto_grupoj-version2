import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Public_Sans } from 'next/font/google';
import '../globals.css';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

// TODO: Crear metadatos para la página de inicio
export const metadata: Metadata = {
  title: 'StudySync',
  description: 'Aprende. Conecta. Avanza.',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
