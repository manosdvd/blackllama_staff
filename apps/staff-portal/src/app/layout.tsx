import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Camp Lawton — Staff Portal',
  description:
    'Camp Lawton staff handbook training, schedules, EAP alarm simulator, safety guides, packing list, campfire metronome songbook, and code of conduct portal.',
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="antialiased min-h-screen relative">
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
