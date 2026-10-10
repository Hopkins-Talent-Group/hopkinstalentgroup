import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, DM_Sans, Manrope } from 'next/font/google';
import './globals.css';

const barlowCondensed = Barlow_Condensed({
  weight: ['500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Hopkins Talent Group | Artist Management & Live Entertainment',
  description:
    'Artist management, live entertainment, talent booking, and event promotion by Hopkins Talent Group.',
};

export const viewport: Viewport = {
  themeColor: '#071321',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${dmSans.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
