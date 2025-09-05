import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '2048 Game Clone - Modern Web Version',
  description: 'A beautiful, feature-rich clone of the popular 2048 puzzle game with leaderboards, animations, and keyboard controls.',
  keywords: ['2048', 'puzzle game', 'tile game', 'merge game', 'brain game'],
  authors: [{ name: 'AI Assistant' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f59e0b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}