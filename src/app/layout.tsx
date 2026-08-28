import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { site } from '@/data/site';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'Korean skincare Bangladesh',
    'K-beauty Dhaka',
    'authentic skincare BD',
    'sunscreen Bangladesh',
    'Seoul Radiance BD',
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body style={{ fontFamily: 'var(--font-jakarta), var(--font-sans)' }}>
        {/* Motion renders its `initial` state into the SSR HTML as opacity:0.
            Without JS the reveal never runs, so force those blocks visible. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
