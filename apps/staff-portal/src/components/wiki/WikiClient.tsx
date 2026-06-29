'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Map, Edit3, RotateCcw, Menu, WifiOff, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';

const MarkdownViewer = dynamic(() => import('./MarkdownViewer'), { 
  ssr: false, 
  loading: () => (
    <div className="animate-pulse space-y-4 py-4 opacity-50">
      <div className="h-6 bg-neutral-800 rounded w-1/3"></div>
      <div className="h-4 bg-neutral-800 rounded w-full"></div>
      <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
      <div className="h-4 bg-neutral-800 rounded w-4/6"></div>
    </div>
  )
});

import { WikiGraph } from '@/components/ui/WikiGraph';
import { createClient } from '@/utils/supabase/client';
import { Article, saveArticlesToIDB, loadArticlesFromIDB } from '@/lib/wiki/idb';
import { useOffline } from '@/hooks/useOffline';

const supabase = createClient();

interface Revision {
  slug: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  revision_no: number;
}

interface OutlineHeading {
  label: string;
  id: string;
}

const categories = [
  'All',
  'Introduction & Culture',
  'Safety & Training',
  'Policies & Procedures',
  'Campfire & Songbook',
  'Onboarding',
];



const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const preprocessMarkdown = (content: string) => {
  if (!content) return '';
  return content.replace(/\[\[(.*?)\]\]/g, (_match, rawLink: string) => {
    let targetName = rawLink;
    let label = rawLink;
    if (rawLink.includes('|')) {
      const [target, displayLabel] = rawLink.split('|');
      targetName = target;
      label = displayLabel;
    }
    return `[${label}](wiki:${encodeURIComponent(targetName)})`;
  });
};

const getOutlineHeadings = (article: Article | null): OutlineHeading[] => {
  if (!article?.content) return [];
  return article.content
    .split('\n')
    .filter((line) => line.startsWith('###') || line.startsWith('####'))
    .map((line) => {
      const label = line.replace(/#/g, '').replace(/\*/g, '').trim();
      return { label, id: slugify(label) };
    });
};

interface WikiClientProps {
  initialArticles: Article[];
}

export function WikiClient({ initialArticles }: WikiClientProps) {
  const isOffline = useOffline();
  
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSlug, setActiveSlug] = useState('welcome-to-camp-lawton-staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Introduction & Culture');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Introduction & Culture');
  const [newContent, setNewContent] = useState('');

  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState('');

  // Handle global nav events
  useEffect(() => {
    const handleGlobalNav = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (slug) {
        setActiveSlug(slug);
        setIsEditing(false);
        setIsMobileTocOpen(false);
      }
    };
    window.addEventListener('wiki-navigate', handleGlobalNav);
    return () => window.removeEventListener('wiki-navigate', handleGlobalNav);
  }, []);

  // Offline & Online Sync Logic
  useEffect(() => {
    const fetchAndSync = async () => {
      setIsSyncing(true);
      if (isOffline) {
        const cached = await loadArticlesFromIDB();
        if (cached && cached.length > 0) {
          setArticles(cached);
        }
      } else {
        const { data, error } = await supabase
          .from('content_items')
          .select(`
            id,
            slug,
            title,
            section,
            offline_priority,
            tags,
            aliases,
            content_categories ( name ),
            content_versions ( content, version_no )
          `);

        if (!error && data) {
          const normalize = (row: any): Article => {
            const category = Array.isArray(row.content_categories) ? row.content_categories[0] : row.content_categories;
            const version = Array.isArray(row.content_versions) ? row.content_versions[0] : row.content_versions;
            const categoryName = category?.name || 'General';
            return {
              id: row.id,
              slug: row.slug,
              title: row.title,
              category: categoryName,
              section: row.section || categoryName,
              content: version?.content || '',
              offline_priority: row.offline_priority ?? 0,
              tags: row.tags || [],
              aliases: row.aliases || [],
              revision_no: version?.version_no || 1,
            };
          };
          const fetchedArticles = data.map(normalize);
          setArticles(fetchedArticles);
          await saveArticlesToIDB(fetchedArticles);
        } else {
          console.error('Wiki client fetch error:', error);
          const cached = await loadArticlesFromIDB();
          if (cached && cached.length > 0) {
            setArticles(cached);
          }
        }
      }
      setIsSyncing(false);
    };
    fetchAndSync();
  }, [isOffline]);

  const activeArticle = articles.find((article) => article.slug === activeSlug) || articles[0] || null;

  const filteredArticles = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchSearch =
        !search ||
        article.title.toLowerCase().includes(search) ||
        article.content.toLowerCase().includes(search) ||
        (article.tags && article.tags.some(t => t.toLowerCase().includes(search))) ||
        (article.aliases && article.aliases.some(a => a.toLowerCase().includes(search)));
      const matchCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  const groupedArticles = useMemo(() => {
    return filteredArticles.reduce<Record<string, Article[]>>((grouped, article) => {
      const section = article.section || 'General';
      grouped[section] = [...(grouped[section] || []), article];
      return grouped;
    }, {});
  }, [filteredArticles]);

  const outlineHeadings = useMemo(() => getOutlineHeadings(activeArticle), [activeArticle]);
  const headingIdsJoined = outlineHeadings.map((heading) => heading.id).join(',');

  useEffect(() => {
    if (!headingIdsJoined) {
      setActiveHeadingId('');
      return;
    }
    let observer: IntersectionObserver | null = null;
    const timeout = window.setTimeout(() => {
      const elements = headingIdsJoined
        .split(',')
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element));
      if (elements.length === 0) return;
      observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries.filter((entry) => entry.isIntersecting);
          if (intersecting.length > 0) {
            intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            setActiveHeadingId(intersecting[0].target.id);
          }
        },
        { rootMargin: '-80px 0px -80% 0px' },
      );
      elements.forEach((element) => observer?.observe(element));
    }, 100);
    return () => {
      window.clearTimeout(timeout);
      observer?.disconnect();
    };
  }, [headingIdsJoined, activeArticle?.slug]);

  const handleSelectArticle = (slug: string) => {
    setActiveSlug(slug);
    setIsEditing(false);
    setIsMobileTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (sectionName: string) => {
    setCollapsedSections((current) => ({
      ...current,
      [sectionName]: !current[sectionName],
    }));
  };

  const handleTriggerCreateUnresolved = (title: string) => {
    setNewTitle(title);
    setNewCategory('Introduction & Culture');
    setNewContent(`Create content for **${title}** here.`);
    setIsCreating(true);
  };

  const handleSaveEdit = async () => {
    if (isOffline) {
      alert("Cannot edit articles while offline. Please connect to the internet first.");
      return;
    }
    if (!editTitle || !activeArticle) return;

    const currentRevisionNo = activeArticle.revision_no || 1;
    const nextRevisionNo = currentRevisionNo + 1;

    const revision: Revision = {
      slug: activeArticle.slug,
      title: activeArticle.title,
      content: activeArticle.content,
      category: activeArticle.category,
      updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
      revision_no: currentRevisionNo,
    };

    setRevisions((current) => [revision, ...current]);

    const parsedTags = editTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const { error: updateError } = await supabase
      .from('content_items')
      .update({
        title: editTitle,
        section: editCategory,
        tags: parsedTags,
        admin_edited_at: new Date().toISOString(),
      })
      .eq('id', activeArticle.id);

    if (updateError) {
      alert(`Failed to save to Supabase: ${updateError.message}`);
      return;
    }

    const { error: versionError } = await supabase.from('content_versions').insert({
      item_id: activeArticle.id,
      version_no: nextRevisionNo,
      content: editContent,
    });

    if (versionError) console.error('Failed to save new version:', versionError);

    const updatedArticles = articles.map((article) =>
      article.id === activeArticle.id
        ? {
            ...article,
            title: editTitle,
            category: editCategory,
            section: editCategory,
            content: editContent,
            tags: parsedTags,
            revision_no: nextRevisionNo,
          }
        : article
    );
    
    setArticles(updatedArticles);
    await saveArticlesToIDB(updatedArticles);
    setIsEditing(false);
  };

  const handleCreatePage = () => {
    if (!newTitle) return;
    const slug = slugify(newTitle);
    if (articles.some((article) => article.slug === slug)) {
      alert('An article with this title or slug already exists.');
      return;
    }
    alert('Creating new articles is currently local-only. Please use the database seeder or API to create new base pages for now.');
    
    const newArticle: Article = {
      id: crypto.randomUUID(),
      slug,
      title: newTitle,
      category: newCategory,
      section: newCategory,
      content: newContent,
      revision_no: 1,
      tags: [],
      aliases: [],
    };

    const updatedArticles = [newArticle, ...articles];
    setArticles(updatedArticles);
    saveArticlesToIDB(updatedArticles);
    setActiveSlug(slug);
    setIsCreating(false);
  };

  const handleRollback = (revision: Revision) => {
    const updatedArticles = articles.map((article) =>
      article.slug === revision.slug
        ? {
            ...article,
            title: revision.title,
            content: revision.content,
            category: revision.category,
            section: revision.category,
            revision_no: (article.revision_no || 1) + 1,
          }
        : article
    );
    setArticles(updatedArticles);
    setIsEditing(false);
  };

  const backlinks = useMemo(() => {
    if (!activeArticle) return [];
    const titleLink = `[[${activeArticle.title}]]`.toLowerCase();
    const slugLink = `[[${activeArticle.slug}]]`.toLowerCase();
    const slugAliasLink = `[[${activeArticle.slug}|`.toLowerCase();

    return articles.filter((article) => {
      if (article.slug === activeArticle.slug) return false;
      const content = article.content.toLowerCase();
      return content.includes(titleLink) || content.includes(slugLink) || content.includes(slugAliasLink);
    });
  }, [activeArticle, articles]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      {/* 1. Sidebar Navigation */}
      <div className="lg:w-[300px] flex flex-col gap-4 flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => { setNewTitle(''); setNewContent(''); setIsCreating(true); }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            <Plus size={14} />
            <span>Create Article</span>
          </button>
          <button
            onClick={() => setIsGraphOpen(true)}
            className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            title="Open Interactive Graph View"
          >
            <Map size={14} />
            <span>Map</span>
          </button>
        </div>

        {isSyncing && <div className="text-sm text-emerald-600 mb-1 font-semibold animate-pulse">Loading from Local Cache...</div>}

        <div className="relative">
          <input
            type="text"
            placeholder="Search wiki..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 text-xs outline-none focus:border-emerald-600/40"
          />
          <Search className="absolute left-3 top-3 text-neutral-400" size={14} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2 mb-1">Filter Categories</span>
          <div className="flex flex-wrap lg:flex-col gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-1.5 px-3 rounded-lg text-left text-xs font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-emerald-800/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-h-[300px] lg:max-h-[70vh] overflow-y-auto pr-1">
          {Object.entries(groupedArticles).map(([section, articlesInSection]) => {
            const isCollapsed = collapsedSections[section];
            return (
              <div key={section} className="flex flex-col mb-2">
                <button
                  onClick={() => toggleSection(section)}
                  className="flex items-center justify-between px-2 py-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors group"
                >
                  <span className="truncate">{section} ({articlesInSection.length})</span>
                  <span>{isCollapsed ? '+' : '−'}</span>
                </button>
                {!isCollapsed && (
                  <div className="flex flex-col gap-1 ml-2 border-l border-neutral-200 dark:border-neutral-800 pl-2">
                    {articlesInSection.map((article) => (
                      <button
                        key={article.slug}
                        onClick={() => handleSelectArticle(article.slug)}
                        className={`py-2 px-3 rounded-lg text-left text-xs transition-all truncate flex items-center justify-between ${
                          activeSlug === article.slug
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'hover:bg-white dark:hover:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400'
                        }`}
                        title={article.title}
                      >
                        <span className="truncate">{article.title}</span>
                        {(article.offline_priority ?? 0) > 0 && <AlertTriangle size={10} className={activeSlug === article.slug ? "text-emerald-200" : "text-amber-500"} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Article View */}
      <div className="flex-1 flex flex-col gap-6 w-full max-w-full overflow-hidden">
        {!activeArticle ? (
          <div className="glass-panel flex-1 flex flex-col items-center justify-center bg-white/70 dark:bg-neutral-900/60 p-6 min-h-[400px]">
            <div className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Article not found</div>
          </div>
        ) : isEditing ? (
          <div className="glass-panel flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/60 p-6">
            {/* ... Editing form is same as before ... */}
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">EDITING: {activeArticle.title}</h3>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Article Title
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none" />
              </label>
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Category
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Tags (comma separated)
                <input type="text" value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="e.g. safety, gear" className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none" />
              </label>
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Article Content (Markdown + double-bracket wiki links)
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={15} className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-mono" />
              </label>
            </div>
            <div className="flex gap-2 justify-end border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
              <button onClick={() => setIsEditing(false)} className="py-2 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} className="py-2 px-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors">Save Revisions</button>
            </div>
          </div>
        ) : (
          <div className="glass-panel flex-1 flex flex-col bg-white/70 dark:bg-neutral-900/60 p-4 md:p-8 relative">
            <div className="flex flex-col mb-8 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-emerald-800/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  
                  {/* Emergency / Offline Visual Badges */}
                  {(activeArticle.offline_priority ?? 0) > 0 && (
                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <AlertTriangle size={12} /> CRITICAL REFERENCE
                    </span>
                  )}
                  {isOffline && (
                    <span className="bg-neutral-500/10 text-neutral-500 border border-neutral-500/20 px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <WifiOff size={12} /> CACHED OFFLINE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                    className="xl:hidden flex items-center gap-1.5 py-2 px-3 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Menu size={14} />
                    <span>Contents</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditTitle(activeArticle.title);
                      setEditCategory(activeArticle.category);
                      setEditContent(activeArticle.content);
                      setEditTags((activeArticle.tags || []).join(', '));
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 py-2 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Edit3 size={14} />
                    <span className="hidden sm:inline">Edit Article</span>
                  </button>
                </div>
              </div>

              {/* Mobile TOC Drawer */}
              {isMobileTocOpen && outlineHeadings.length > 0 && (
                <div className="xl:hidden mt-4 p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2 block">In This Article</span>
                  <nav className="flex flex-col gap-2">
                    {outlineHeadings.map((heading) => (
                      <a
                        key={`mobile-${heading.id}`}
                        href={`#${heading.id}`}
                        onClick={() => setIsMobileTocOpen(false)}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                      >
                        {heading.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <h2 className="text-2xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100 font-heading tracking-wide mt-2">
                {activeArticle.title}
              </h2>
            </div>

            <div className="min-h-[250px] overflow-hidden w-full max-w-full">
              <div className="flex flex-wrap gap-2 mb-6">
                {activeArticle.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-neutral-200/50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-body
                [&>h1]:text-3xl [&>h1]:font-black [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-emerald-950 dark:[&>h1]:text-emerald-50
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-emerald-900 dark:[&>h2]:text-emerald-100 [&>h2]:border-b [&>h2]:border-neutral-200 dark:[&>h2]:border-neutral-800 [&>h2]:pb-2
                [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-neutral-800 dark:[&>h3]:text-neutral-200
                [&>h4]:text-lg [&>h4]:font-bold [&>h4]:mt-5 [&>h4]:mb-2 
                [&>p]:mb-5 
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:mb-2
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol>li]:mb-2
                [&>blockquote]:border-l-4 [&>blockquote]:border-amber-500 [&>blockquote]:bg-amber-50 dark:[&>blockquote]:bg-amber-950/20 [&>blockquote]:p-4 [&>blockquote]:italic [&>blockquote]:mb-5 [&>blockquote]:rounded-r-lg
                [&>table]:w-full [&>table]:mb-5 [&>table]:border-collapse
                [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-neutral-300 dark:[&>table>thead>tr>th]:border-neutral-700 [&>table>thead>tr>th]:p-2 [&>table>thead>tr>th]:bg-neutral-100 dark:[&>table>thead>tr>th]:bg-neutral-800
                [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-neutral-300 dark:[&>table>tbody>tr>td]:border-neutral-700 [&>table>tbody>tr>td]:p-2
                w-full break-words max-w-full">
              <div className="prose prose-invert max-w-none 
                  prose-headings:text-neutral-200 prose-headings:font-bebas prose-headings:tracking-wide
                  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                  prose-a:text-emerald-400 hover:prose-a:text-emerald-300
                  prose-strong:text-neutral-200
                  prose-code:text-amber-300 prose-code:bg-black/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-neutral-900/50 prose-pre:border prose-pre:border-neutral-800
                  prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-950/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
                  prose-hr:border-neutral-800
                  prose-img:rounded-lg prose-img:border prose-img:border-neutral-800
                  prose-th:text-neutral-300 prose-th:border-neutral-800 prose-td:border-neutral-800"
                  style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}
              >
                <MarkdownViewer 
                  content={preprocessMarkdown(activeArticle.content)}
                  articles={articles}
                  handleSelectArticle={handleSelectArticle}
                  handleTriggerCreateUnresolved={handleTriggerCreateUnresolved}
                  slugify={slugify}
                />
              </div>
            </div>

            {backlinks.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800/60 pt-6 mt-6">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Map size={12} /> Related Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {backlinks.map((backlink) => (
                    <button
                      key={backlink.slug}
                      onClick={() => handleSelectArticle(backlink.slug)}
                      className="py-1.5 px-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-xs font-bold rounded-lg text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm"
                    >
                      {backlink.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Sticky Desktop TOC */}
      <div className="lg:w-[220px] flex-shrink-0 hidden xl:flex flex-col gap-4 sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto">
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2">On This Page</span>
        {outlineHeadings.length > 0 ? (
          <nav className="flex flex-col gap-2 border-l border-neutral-200 dark:border-neutral-800 pl-3 py-1 relative">
            {outlineHeadings.map((heading) => (
              <a
                key={`desktop-${heading.id}`}
                href={`#${heading.id}`}
                className={`text-xs transition-colors leading-normal relative ${
                  activeHeadingId === heading.id
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {activeHeadingId === heading.id && <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-full" />}
                {heading.label}
              </a>
            ))}
          </nav>
        ) : (
          <span className="text-[11px] text-neutral-500 italic px-2">No sections</span>
        )}
      </div>

      {/* 4. Connection Map Modal */}
      {isGraphOpen && (
        <WikiGraph
          articles={articles}
          onNodeClick={(slug) => handleSelectArticle(slug)}
          onClose={() => setIsGraphOpen(false)}
        />
      )}

      {/* 5. Create Page Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 text-neutral-800 dark:text-neutral-200">
            <h3 className="font-extrabold text-lg font-heading text-emerald-800 dark:text-emerald-500 tracking-wide">CREATE NEW WIKI ARTICLE</h3>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Article Title *
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none" />
              </label>
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Category
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Content (Markdown)
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={8} className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-mono" />
              </label>
            </div>
            <div className="flex gap-2 justify-end border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
              <button onClick={() => setIsCreating(false)} className="py-2 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
              <button onClick={handleCreatePage} className="py-2 px-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors">Create Article</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
