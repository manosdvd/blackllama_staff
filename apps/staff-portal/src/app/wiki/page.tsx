'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Map, Edit3, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize from 'rehype-sanitize';
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

export default function WikiPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState('welcome-to-camp-lawton-staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Introduction & Culture');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  
  // Page Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Introduction & Culture');
  const [newContent, setNewContent] = useState('');
  
  // Revisions history (mocked for now until phase 4)
  const [revisions, setRevisions] = useState<Revision[]>([]);

  // Categories list
  const categories = ['All', 'Introduction & Culture', 'Safety & Training', 'Policies & Procedures', 'Campfire & Songbook', 'Onboarding'];

  useEffect(() => {
    const handleGlobalNav = (e: Event) => {
      const slug = (e as CustomEvent).detail;
      if (slug) {
        setActiveSlug(slug);
        setIsEditing(false);
      }
    };
    window.addEventListener('wiki-navigate', handleGlobalNav);
    
    return () => {
      window.removeEventListener('wiki-navigate', handleGlobalNav);
    };
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
        const parsed = data.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          slug: d.slug as string,
          title: d.title as string,
          category: d.content_categories?.name || 'General',
          section: d.section || d.content_categories?.name || 'General',
          content: (d.content_versions && d.content_versions.length > 0) ? d.content_versions[0].content : '',
          offline_priority: d.offline_priority,
          tags: d.tags || [],
          aliases: d.aliases || [],
          revision_no: (d.content_versions && d.content_versions.length > 0) ? d.content_versions[0].version_no : 1
        }));
        
        // Sort articles if needed, or just set them
        setArticles(parsed);
      } else {
        console.error('Wiki fetch error:', error);
      }
      setIsLoading(false);
    };

    fetchWiki();
  }, []);

  const activeArticle = articles.find(a => a.slug === activeSlug) || articles[0] || null;

  const handleSelectArticle = (slug: string) => {
    setActiveSlug(slug);
    setIsEditing(false);
  };

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const getFilteredArticles = () => {
    return articles.filter(art => {
      const matchSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || art.category === selectedCategory;
      return matchSearch && matchCat;
    });
  };

  // Preprocess content before ReactMarkdown to handle [[WikiLinks]]
  const preprocessMarkdown = (content: string) => {
    if (!content) return '';
    return content.replace(/\[\[(.*?)\]\]/g, (match, rawLink) => {
      let targetName = rawLink;
      let label = rawLink;
      if (rawLink.includes('|')) {
        const split = rawLink.split('|');
        targetName = split[0];
        label = split[1];
      }
      return `[${label}](wiki:${targetName})`;
    });
  };

  const handleTriggerCreateUnresolved = (title: string) => {
    setNewTitle(title);
    setNewCategory('Introduction & Culture');
    setNewContent(`Create content for **${title}** here.`);
    setIsCreating(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle || !activeArticle) return;

    // Create a revision backup first
    const currentRevNo = activeArticle.revision_no || 1;
    const newRev: Revision = {
      slug: activeArticle.slug,
      title: activeArticle.title,
      content: activeArticle.content,
      category: activeArticle.category,
      updatedAt: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
      revision_no: currentRevNo
    };

    const updatedRevisions = [newRev, ...revisions];
    setRevisions(updatedRevisions);

    const newRevNo = currentRevNo + 1;

    // 1. Update the article metadata in Supabase
    const { error: updateError } = await supabase
      .from('content_items')
      .update({
        title: editTitle,
        section: editCategory, // Storing category in section for now, ideally needs category_id
        tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
        admin_edited_at: new Date().toISOString()
      })
      .eq('id', activeArticle.id);

    if (updateError) {
      alert('Failed to save to Supabase: ' + updateError.message);
      return;
    }

    // 2. Insert the new content version
    const { error: versionError } = await supabase
      .from('content_versions')
      .insert({
        item_id: activeArticle.id,
        version_no: newRevNo,
        content: editContent
      });

    if (versionError) {
      console.error('Failed to save new version:', versionError);
    }

    // Update main article details locally
    const updated = articles.map(art => {
      if (art.id === activeArticle.id) {
        return {
          ...art,
          title: editTitle,
          category: editCategory,
          content: editContent,
          tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
          revision_no: newRevNo
        };
      }
      return art;
    });

    setArticles(updated);
    setIsEditing(false);
  };

  const handleCreatePage = () => {
    if (!newTitle) return;

    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const exists = articles.some(a => a.slug === slug);
    if (exists) {
      alert('An article with this title or slug already exists.');
      return;
    }

    // Note: To fully create a page in Supabase, we'd need to fetch or assign a category_id. 
    // This is a simplified local-first insert for now, real DB insert omitted for brevity
    // unless we look up category IDs first. Let's alert the user that it's local only.
    alert('Creating new articles is currently local-only. Please use the database seeder or API to create new base pages for now.');

    const newArt: Article = {
      id: crypto.randomUUID(),
      slug,
      title: newTitle,
      category: newCategory,
      content: newContent,
      revision_no: 1,
      tags: []
    };

    const updated = [newArt, ...articles];
    setArticles(updated);
    setActiveSlug(slug);
    setIsCreating(false);
  };

  const handleRollback = (rev: Revision) => {
    const updated = articles.map(art => {
      if (art.slug === rev.slug) {
        return {
          ...art,
          title: rev.title,
          content: rev.content,
          category: rev.category,
          revision_no: (art.revision_no || 1) + 1
        };
      }
      return art;
    });

    setArticles(updated);
    setIsEditing(false);
  };

  // Find backlinks linking to current article
  const getBacklinks = () => {
    if (!activeArticle) return [];
    return articles.filter(art => {
      if (art.slug === activeArticle.slug) return false;
      const searchStr = `[[${activeArticle.title}]]`.toLowerCase();
      const searchStrSlug = `[[${activeArticle.slug}|`.toLowerCase();
      const searchStrSlugExact = `[[${activeArticle.slug}]]`.toLowerCase();
      return (
        art.content.toLowerCase().includes(searchStr) ||
        art.content.toLowerCase().includes(searchStrSlug) ||
        art.content.toLowerCase().includes(searchStrSlugExact)
      );
    });
  };

  // Dynamically extract headings from content for Table of Contents outline
  const getOutlineHeadings = () => {
    if (!activeArticle || !activeArticle.content) return [];
    const lines = activeArticle.content.split('\n');
    return lines
      .filter(line => line.startsWith('###') || line.startsWith('####'))
      .map(line => {
        const clean = line.replace(/#/g, '').replace(/\*/g, '').trim();
        const id = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { label: clean, id };
      });
  };

  const outlineHeadings = getOutlineHeadings();
  const headingIdsJoined = outlineHeadings.map(h => h.id).join(',');

  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  useEffect(() => {
    if (!headingIdsJoined) {
      setActiveHeadingId('');
      return;
    }
    
    const timeout = setTimeout(() => {
      const ids = headingIdsJoined.split(',');
      const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      if (elements.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        const intersecting = entries.filter(entry => entry.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveHeadingId(intersecting[0].target.id);
        }
      }, {
        rootMargin: '-80px 0px -80% 0px'
      });

      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, [headingIdsJoined, activeArticle?.slug]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      {/* Sidebar navigation list */}
      <div className="lg:w-[300px] flex flex-col gap-4 flex-shrink-0">
        <div className="flex gap-2">
          {/* Create article trigger */}
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

          {/* Graph view map trigger */}
          <button
            onClick={() => setIsGraphOpen(true)}
            className="bg-neutral-100 hover:bg-neutral-250 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            title="Open Interactive Graph View"
          >
            <Map size={14} />
            <span>Connection Map</span>
          </button>
        </div>

        {/* Search input bar */}
        {isLoading && <div className="text-sm text-emerald-600 mb-1 font-semibold animate-pulse">Syncing from Supabase...</div>}
        <div className="relative">
          <input
            type="text"
            placeholder="Search wiki..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 text-xs outline-none focus:border-emerald-600/40"
          />
          <Search className="absolute left-3 top-3 text-neutral-400" size={14} />
        </div>

        {/* Category list filters */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2 mb-1">
            Filter Categories
          </span>
          <div className="flex flex-wrap lg:flex-col gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-lg text-left text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-800/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List (Grouped by Section) */}
        <div className="flex flex-col gap-1 max-h-[300px] lg:max-h-[70vh] overflow-y-auto pr-1">
          {(() => {
            const filtered = getFilteredArticles();
            const grouped = filtered.reduce((acc, art) => {
              const sec = art.section || 'General';
              if (!acc[sec]) acc[sec] = [];
              acc[sec].push(art);
              return acc;
            }, {} as Record<string, Article[]>);

            return Object.entries(grouped).map(([section, articlesInSection]) => {
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
                      {articlesInSection.map(art => (
                        <button
                          key={art.slug}
                          onClick={() => handleSelectArticle(art.slug)}
                          className={`py-2 px-3 rounded-lg text-left text-xs transition-all truncate ${
                            activeSlug === art.slug
                              ? 'bg-emerald-800 text-white font-bold'
                              : 'hover:bg-white dark:hover:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400'
                          }`}
                          title={art.title}
                        >
                          {art.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Center content viewer */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Loading state if activeArticle is missing */}
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
        
        {/* Editor panel toggler */}
        {isEditing && activeArticle ? (
          <div className="glass-panel flex flex-col gap-4 bg-white/70 dark:bg-neutral-900/60 p-6">
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">
              EDITING: {activeArticle.title}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Article Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. safety, gear, bear-safety"
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Article Content (Markdown + double-bracket wiki links)</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={15}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="py-2 px-4 rounded-xl border border-neutral-350 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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

            {/* Revision rollbacks list */}
            {revisions.filter(r => r.slug === activeArticle.slug).length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800/65 pt-4 mt-2">
                <h4 className="text-xs font-extrabold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2.5">
                  Rollback Version History
                </h4>
                <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-1">
                  {revisions
                    .filter(r => r.slug === activeArticle.slug)
                    .map((rev, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-100 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs"
                      >
                        <div>
                          <div className="font-bold text-neutral-800 dark:text-neutral-200">
                            Version {rev.revision_no} • {rev.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">Saved: {rev.updatedAt}</div>
                        </div>
                        <button
                          onClick={() => handleRollback(rev)}
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
            
            {/* Header / Meta */}
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
                  className="flex items-center gap-1.5 py-2 px-4 border border-neutral-350 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Edit Article</span>
                </button>
              </div>
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-neutral-100 font-heading tracking-wide mt-2">
                  {activeArticle.title}
                </h2>
            </div>

            {/* Wiki Link Parsed Content */}
            <div className="min-h-[250px] overflow-hidden">
              <div className="flex flex-wrap gap-2 mb-4">
                {activeArticle.tags?.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
                {activeArticle.aliases?.map(alias => (
                  <span key={alias} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {alias}
                  </span>
                ))}
              </div>
              <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-5 [&>h3]:mb-2 [&>h4]:text-base [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1 [&>blockquote]:border-l-4 [&>blockquote]:border-neutral-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug, rehypeSanitize]}
                  components={{
                    a: ({ ...props }: Record<string, unknown>) => {
                      const isInternal = (props.href as string)?.startsWith('wiki:');
                      if (isInternal) {
                        const targetName = decodeURIComponent((props.href as string).replace('wiki:', ''));
                        const targetSlug = targetName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        const targetExists = articles.some(a => a.slug === targetSlug);
                        if (targetExists) {
                          return (
                            <button
                              onClick={() => handleSelectArticle(targetSlug)}
                              className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold inline"
                            >
                              {props.children}
                            </button>
                          );
                        } else {
                          return (
                            <button
                              onClick={() => handleTriggerCreateUnresolved(targetName)}
                              className="text-red-500 hover:text-red-600 font-bold border-b-2 border-dashed border-red-500 cursor-pointer inline"
                              title="Click to create this handbook article"
                            >
                              {props.children} ❓
                            </button>
                          );
                        }
                      }
                      return <a {...props} className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer" />;
                    }
                  }}
                >
                  {preprocessMarkdown(activeArticle.content)}
                </ReactMarkdown>
              </div>
            </div>

            {/* Backlinks panel */}
            {getBacklinks().length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-2.5">
                  Backlinks linking to this page
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getBacklinks().map(bl => (
                    <button
                      key={bl.slug}
                      onClick={() => handleSelectArticle(bl.slug)}
                      className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-xs font-bold rounded-lg text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      {bl.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Right rail outline table of contents (TOC) */}
      <div className="lg:w-[220px] flex-shrink-0 hidden xl:flex flex-col gap-4 sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto">
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider px-2">
          Article Outline
        </span>
        {outlineHeadings.length > 0 ? (
          <nav className="flex flex-col gap-2 border-l border-neutral-200 dark:border-neutral-850 pl-3 py-1 relative">
            {outlineHeadings.map((h, idx) => (
              <a
                key={idx}
                href={`#${h.id}`}
                className={`text-xs transition-colors leading-normal relative ${
                  activeHeadingId === h.id
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
                title={`Jump to ${h.label}`}
              >
                {activeHeadingId === h.id && (
                  <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
                )}
                {h.label}
              </a>
            ))}
          </nav>
        ) : (
          <span className="text-[11px] text-neutral-500 italic px-2">No headings in outline.</span>
        )}
      </div>

      {/* Connection Graph View Modal */}
      {isGraphOpen && (
        <WikiGraph
          articles={articles}
          onNodeClick={(slug) => handleSelectArticle(slug)}
          onClose={() => setIsGraphOpen(false)}
        />
      )}

      {/* Creation Modal dialog overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 text-neutral-800 dark:text-neutral-200">
            <h3 className="font-extrabold text-lg font-heading text-emerald-800 dark:text-emerald-500 tracking-wide">
              CREATE NEW WIKI ARTICLE
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Article Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Wilderness Survival Merit Badge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Content (Markdown)</label>
                <textarea
                  placeholder="Write article content here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={8}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="py-2 px-4 rounded-xl border border-neutral-350 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
