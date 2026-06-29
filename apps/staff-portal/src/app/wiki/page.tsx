'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Map, Edit3, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { WikiGraph } from '@/components/ui/WikiGraph';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  section?: string;
  content: string;
  offline_priority?: number;
  tags?: string[];
  aliases?: string[];
  revision_no?: number;
}

interface Revision {
  slug: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  revision_no: number;
}

interface ContentCategoryRow {
  name: string | null;
}

interface ContentVersionRow {
  content: string | null;
  version_no: number | null;
}

interface ContentItemRow {
  id: string;
  slug: string;
  title: string;
  section: string | null;
  offline_priority: number | null;
  tags: string[] | null;
  aliases: string[] | null;
  content_categories: ContentCategoryRow | ContentCategoryRow[] | null;
  content_versions: ContentVersionRow | ContentVersionRow[] | null;
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

const sanitizeSchema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href || []), 'wiki'],
  },
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const firstRelation = <T,>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

const normalizeContentItem = (row: ContentItemRow): Article => {
  const category = firstRelation(row.content_categories);
  const version = firstRelation(row.content_versions);
  const categoryName = category?.name || 'General';

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: categoryName,
    section: row.section || categoryName,
    content: version?.content || '',
    offline_priority: row.offline_priority ?? undefined,
    tags: row.tags || [],
    aliases: row.aliases || [],
    revision_no: version?.version_no || 1,
  };
};

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

export default function WikiPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState('welcome-to-camp-lawton-staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isGraphOpen, setIsGraphOpen] = useState(false);

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

  useEffect(() => {
    const handleGlobalNav = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (slug) {
        setActiveSlug(slug);
        setIsEditing(false);
      }
    };

    window.addEventListener('wiki-navigate', handleGlobalNav);
    return () => window.removeEventListener('wiki-navigate', handleGlobalNav);
  }, []);

  useEffect(() => {
    const fetchWiki = async () => {
      setIsLoading(true);

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
        setArticles((data as ContentItemRow[]).map(normalizeContentItem));
      } else {
        console.error('Wiki fetch error:', error);
      }

      setIsLoading(false);
    };

    fetchWiki();
  }, []);

  const activeArticle = articles.find((article) => article.slug === activeSlug) || articles[0] || null;

  const filteredArticles = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchSearch =
        !search ||
        article.title.toLowerCase().includes(search) ||
        article.content.toLowerCase().includes(search);
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

    if (versionError) {
      console.error('Failed to save new version:', versionError);
    }

    setArticles((current) =>
      current.map((article) =>
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
          : article,
      ),
    );

    setIsEditing(false);
  };

  const handleCreatePage = () => {
    if (!newTitle) return;

    const slug = slugify(newTitle);
    const exists = articles.some((article) => article.slug === slug);

    if (exists) {
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

    setArticles((current) => [newArticle, ...current]);
    setActiveSlug(slug);
    setIsCreating(false);
  };

  const handleRollback = (revision: Revision) => {
    setArticles((current) =>
      current.map((article) =>
        article.slug === revision.slug
          ? {
              ...article,
              title: revision.title,
              content: revision.content,
              category: revision.category,
              section: revision.category,
              revision_no: (article.revision_no || 1) + 1,
            }
          : article,
      ),
    );

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
      <div className="lg:w-[300px] flex flex-col gap-4 flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewTitle('');
              setNewContent('');
              setIsCreating(true);
            }}
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
            <span>Connection Map</span>
          </button>
        </div>

        {isLoading && <div className="text-sm text-emerald-600 mb-1 font-semibold animate-pulse">Syncing from Supabase...</div>}

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
                        className={`py-2 px-3 rounded-lg text-left text-xs transition-all truncate ${
                          activeSlug === article.slug
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'hover:bg-white dark:hover:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400'
                        }`}
                        title={article.title}
                      >
                        {article.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {!activeArticle && isLoading && (
          <div className="glass-panel flex-1 flex flex-col items-center justify-center bg-white/70 dark:bg-neutral-900/60 p-6 min-h-[400px]">
            <div className="animate-pulse text-emerald-600 font-bold uppercase tracking-widest text-xs">Loading Wiki...</div>
          </div>
        )}

        {!activeArticle && !isLoading && (
          <div className="glass-panel flex-1 flex flex-col items-center justify-center bg-white/70 dark:bg-neutral-900/60 p-6 min-h-[400px]">
            <div className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Article not found</div>
          </div>
        )}

        {isEditing && activeArticle ? (
          <div className="glass-panel flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/60 p-6">
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">EDITING: {activeArticle.title}</h3>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Article Title
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Category
                <select
                  value={editCategory}
                  onChange={(event) => setEditCategory(event.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                >
                  {categories.filter((category) => category !== 'All').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Tags (comma separated)
                <input
                  type="text"
                  value={editTags}
                  onChange={(event) => setEditTags(event.target.value)}
                  placeholder="e.g. safety, gear, bear-safety"
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Article Content (Markdown + double-bracket wiki links)
                <textarea
                  value={editContent}
                  onChange={(event) => setEditContent(event.target.value)}
                  rows={15}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-mono"
                />
              </label>
            </div>

            <div className="flex gap-2 justify-end border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="py-2 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="py-2 px-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Revisions
              </button>
            </div>

            {revisions.filter((revision) => revision.slug === activeArticle.slug).length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800/65 pt-4 mt-2">
                <h4 className="text-xs font-extrabold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2.5">Rollback Version History</h4>
                <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-1">
                  {revisions
                    .filter((revision) => revision.slug === activeArticle.slug)
                    .map((revision, index) => (
                      <div key={`${revision.slug}-${revision.revision_no}-${index}`} className="p-3 bg-neutral-100 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-neutral-800 dark:text-neutral-200">Version {revision.revision_no} • {revision.title}</div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">Saved: {revision.updatedAt}</div>
                        </div>
                        <button
                          onClick={() => handleRollback(revision)}
                          className="flex items-center gap-1 py-1.5 px-3 bg-emerald-800/10 hover:bg-emerald-800/20 text-emerald-800 dark:text-emerald-400 rounded-lg text-[10px] font-bold transition-colors"
                        >
                          <RotateCcw size={10} />
                          <span>Revert</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : activeArticle ? (
          <div className="glass-panel flex-1 flex flex-col bg-white/70 dark:bg-neutral-900/60 p-6 relative">
            <div className="flex flex-col mb-8 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-emerald-800/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                </div>
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
                  <span>Edit Article</span>
                </button>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-neutral-100 font-heading tracking-wide mt-2">
                {activeArticle.title}
              </h2>
            </div>

            <div className="min-h-[250px] overflow-hidden">
              <div className="flex flex-wrap gap-2 mb-4">
                {activeArticle.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
                {activeArticle.aliases?.map((alias) => (
                  <span key={alias} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {alias}
                  </span>
                ))}
              </div>

              <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-5 [&>h3]:mb-2 [&>h4]:text-base [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1 [&>blockquote]:border-l-4 [&>blockquote]:border-neutral-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug, [rehypeSanitize, sanitizeSchema]]}
                  components={{
                    a: ({ href, children, ...props }) => {
                      const safeHref = typeof href === 'string' ? href : '';
                      const isInternal = safeHref.startsWith('wiki:');

                      if (isInternal) {
                        const targetName = decodeURIComponent(safeHref.replace('wiki:', ''));
                        const targetSlug = slugify(targetName);
                        const targetExists = articles.some((article) => article.slug === targetSlug);

                        if (targetExists) {
                          return (
                            <button
                              onClick={() => handleSelectArticle(targetSlug)}
                              className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold inline"
                            >
                              {children}
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={() => handleTriggerCreateUnresolved(targetName)}
                            className="text-red-500 hover:text-red-600 font-bold border-b-2 border-dashed border-red-500 cursor-pointer inline"
                            title="Click to create this handbook article"
                          >
                            {children} ❓
                          </button>
                        );
                      }

                      return <a {...props} href={href} className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>;
                    },
                  }}
                >
                  {preprocessMarkdown(activeArticle.content)}
                </ReactMarkdown>
              </div>
            </div>

            {backlinks.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-2.5">Backlinks linking to this page</h4>
                <div className="flex flex-wrap gap-2">
                  {backlinks.map((backlink) => (
                    <button
                      key={backlink.slug}
                      onClick={() => handleSelectArticle(backlink.slug)}
                      className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-xs font-bold rounded-lg text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      {backlink.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="lg:w-[220px] flex-shrink-0 hidden xl:flex flex-col gap-4 sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto">
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2">Article Outline</span>
        {outlineHeadings.length > 0 ? (
          <nav className="flex flex-col gap-2 border-l border-neutral-200 dark:border-neutral-800 pl-3 py-1 relative">
            {outlineHeadings.map((heading, index) => (
              <a
                key={`${heading.id}-${index}`}
                href={`#${heading.id}`}
                className={`text-xs transition-colors leading-normal relative ${
                  activeHeadingId === heading.id
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
                title={`Jump to ${heading.label}`}
              >
                {activeHeadingId === heading.id && <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-full" />}
                {heading.label}
              </a>
            ))}
          </nav>
        ) : (
          <span className="text-[11px] text-neutral-500 italic px-2">No headings in outline.</span>
        )}
      </div>

      {isGraphOpen && (
        <WikiGraph
          articles={articles}
          onNodeClick={(slug) => handleSelectArticle(slug)}
          onClose={() => setIsGraphOpen(false)}
        />
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 text-neutral-800 dark:text-neutral-200">
            <h3 className="font-extrabold text-lg font-heading text-emerald-800 dark:text-emerald-500 tracking-wide">CREATE NEW WIKI ARTICLE</h3>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Article Title *
                <input
                  type="text"
                  placeholder="e.g. Wilderness Survival Merit Badge"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Category
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                >
                  {categories.filter((category) => category !== 'All').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-[10px] text-neutral-400 font-bold uppercase">
                Content (Markdown)
                <textarea
                  placeholder="Write article content here..."
                  value={newContent}
                  onChange={(event) => setNewContent(event.target.value)}
                  rows={8}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-mono"
                />
              </label>
            </div>

            <div className="flex gap-2 justify-end border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="py-2 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                className="py-2 px-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Publish Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
