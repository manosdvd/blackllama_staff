import { ExternalLink, ShieldAlert, Navigation, Leaf } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'External Resources - Camp Lawton',
};

const EXTERNAL_LINKS = [
  {
    title: 'Living with Wildlife Reference',
    source: 'Arizona Game and Fish Department',
    description: 'Official safety guidelines for coexisting with bears, mountain lions, and other local wildlife in the Santa Catalina Mountains.',
    url: 'https://www.azgfd.com/wildlife-conservation/living-with-wildlife/',
    icon: Leaf,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Arizona Road Status (AZ511)',
    source: 'ADOT',
    description: 'Real-time road conditions, closures, and incidents for the Catalina Highway and surrounding routes.',
    url: 'https://www.az511.gov/',
    icon: Navigation,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Coronado National Forest Alerts',
    source: 'US Forest Service',
    description: 'Active forest orders, fire restrictions, and closures affecting the Mt. Lemmon area.',
    url: 'https://www.fs.usda.gov/r03/coronado/alerts',
    icon: ShieldAlert,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  }
];

export default function ExternalLinksPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-neutral-800 pb-6">
        <h1 className="text-4xl md:text-5xl font-bebas tracking-wide text-neutral-100">
          External Resources
        </h1>
        <p className="text-neutral-400 mt-2 text-lg">
          Official 3rd-party links for operational context, safety, and region monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXTERNAL_LINKS.map((link, i) => {
          const Icon = link.icon;
          return (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={64} className={link.color} />
              </div>
              
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${link.bg}`}>
                <Icon size={24} className={link.color} />
              </div>
              
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">
                {link.source}
              </div>
              
              <h2 className="text-lg font-bold text-neutral-200 group-hover:text-white mb-2 flex items-center gap-2">
                {link.title}
              </h2>
              
              <p className="text-sm text-neutral-400 flex-1">
                {link.description}
              </p>
              
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 group-hover:text-emerald-400 transition-colors">
                Visit Site <ExternalLink size={12} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
