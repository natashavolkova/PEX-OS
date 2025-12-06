import type { Metadata } from 'next';
import './globals.css';
import { AthenaThemeProvider } from '@/components/providers/AthenaThemeProvider';
import { KeyboardShortcutHandler } from '@/components/providers/KeyboardShortcutHandler';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'AthenaPeX Productivity Manager',
  description: 'ENTJ-Style Productivity & Project Management System - Olympian Excellence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-athena-navy-deep text-athena-platinum font-inter antialiased">
        <QueryProvider>
          <AthenaThemeProvider defaultTheme="dark" storageKey="athenapex-ui-theme">
            <KeyboardShortcutHandler />
            {children}
          </AthenaThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
