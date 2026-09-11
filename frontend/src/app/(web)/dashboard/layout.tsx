import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Public_Sans } from 'next/font/google';
import '../globals.css';

import SideBar from '@/components/layout/dashboard/sidebar/SideBar';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

// Metadatos optimizados para el Dashboard
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

export default function DashboardLayout({
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
        {/* Contenedor flex para poner el Sidebar al lado del contenido principal */}
        <div className="flex min-h-screen w-full">
          <SideBar />
          <main className="bg-background min-h-screen flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
