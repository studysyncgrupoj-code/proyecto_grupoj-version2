import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Public_Sans } from 'next/font/google';
import '../../globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

// Metadatos optimizados para el Dashboard (Evita indexación por privacidad)
export const metadata: Metadata = {
  title: 'Dashboard | StudySync',
  description:
    'Panel de control de StudySync. Gestiona tu aprendizaje, conexiones y progreso.',
  robots: {
    index: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
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
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
