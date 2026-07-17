import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'FitMaster – Seu App de Treinos Premium',
  description: 'Gerencie seus treinos, acompanhe seu progresso e alcance seus objetivos fitness com o FitMaster.',
  keywords: ['academia', 'treino', 'fitness', 'exercício', 'musculação', 'app fitness'],
  authors: [{ name: 'FitMaster Team' }],
  openGraph: {
    title: 'FitMaster – Seu App de Treinos Premium',
    description: 'Gerencie seus treinos, acompanhe seu progresso e alcance seus objetivos fitness.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
