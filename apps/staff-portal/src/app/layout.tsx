import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Outfit, Plus_Jakarta_Sans, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { EmberBackground } from '@/components/ui/EmberBackground';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800']
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800']
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: ['400']
});

// Viewport must be exported separately (Next.js 13.4+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  title: 'Camp Lawton — Staff Portal',
  description:
    'Camp Lawton staff handbook training, schedules, EAP alarm simulator, safety guides, packing list, campfire metronome songbook, and code of conduct portal.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/camp-logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} ${bebasNeue.variable}`}>
      <body className="antialiased min-h-screen relative">
        {/* Inline script: sets theme before first paint to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('lawton_theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`
          }}
        />
        {/* Canvas animated backdrop */}
        <EmberBackground />

        {/* App Shell routing layer */}
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
