import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Our Explorer',
  description: 'Jelajahi tempat-tempat indah bersama — Studio Ghibli inspired travel journal',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFF5F0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
