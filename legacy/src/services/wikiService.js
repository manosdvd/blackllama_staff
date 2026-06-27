import { api } from './apiClient.js';
import { rawHandbook } from '../data/rawHandbook.js';

// Helper to generate a URL-safe slug from a title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to check if a page matches a target (by slug or title)
function findPageByTarget(target, pages) {
  const normTarget = target.toLowerCase().trim();
  const normSlug = generateSlug(target);
  return pages.find(p => 
    p.slug.toLowerCase() === normTarget ||
    p.slug.toLowerCase() === normSlug ||
    p.title.toLowerCase() === normTarget
  );
}

export const wikiService = {
  // Local cache memory store
  _localPages: null,

  /**
   * Fetch all wiki pages. Falls back to localStorage and seeds if offline/empty.
   */
  async listPages() {
    try {
      const data = await api.wiki.list();
      if (data && data.pages) {
        this._localPages = data.pages;
        // Cache locally for offline use
        localStorage.setItem('lawton_wiki_pages', JSON.stringify(data.pages));
        return data.pages;
      }
    } catch (err) {
      console.warn('Wiki list from API failed, falling back to local storage:', err);
    }

    // Offline / Fallback flow
    const cached = localStorage.getItem('lawton_wiki_pages');
    if (cached) {
      this._localPages = JSON.parse(cached);
      return this._localPages;
    }

    // Seed from rawHandbook if nothing exists anywhere
    const seeded = this._seedFromHandbook();
    this._localPages = seeded;
    localStorage.setItem('lawton_wiki_pages', JSON.stringify(seeded));
    return seeded;
  },

  /**
   * Fetch details for a single page, including revisions.
   */
  async getPage(slug) {
    try {
      const data = await api.wiki.get(slug);
      if (data && data.page) {
        return {
          page: data.page,
          revisions: data.revisions || []
        };
      }
    } catch (err) {
      console.warn(`Wiki get page '${slug}' from API failed, falling back to local storage:`, err);
    }

    // Offline / Fallback
    const pages = await this.listPages();
    const page = pages.find(p => p.slug === slug);
    if (!page) {
      throw new Error(`Wiki page not found: ${slug}`);
    }

    // Reconstruct full content from local store if needed (list only has metadata)
    // Local storage stores full pages in offline mode
    const fullLocalPage = this._getFullLocalPage(slug) || page;

    // Load revisions from local storage
    const allLocalRevs = JSON.parse(localStorage.getItem('lawton_wiki_revisions') || '{}');
    const pageRevs = allLocalRevs[slug] || [];

    return {
      page: fullLocalPage,
      revisions: pageRevs
    };
  },

  /**
   * Create or update a page.
   */
  async savePage(slug, title, content, category, tags = []) {
    // Generate slug if not provided
    const pageSlug = slug || generateSlug(title);
    
    // Ensure tags is array
    const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const savedPage = await api.wiki.save(pageSlug, title, content, category, tagArray);
      if (savedPage) {
        // Sync local list cache
        await this.listPages();
        return savedPage;
      }
    } catch (err) {
      console.warn('Wiki save to API failed, saving to local storage:', err);
    }

    // Offline / Local storage save flow
    const pages = await this.listPages();
    const existingIndex = pages.findIndex(p => p.slug === pageSlug);

    const currentUser = JSON.parse(localStorage.getItem('lawton_user'))?.username || 'Guest';
    let revisionNo = 1;

    if (existingIndex !== -1) {
      revisionNo = (pages[existingIndex].revision_no || 1) + 1;
    }

    const localPage = {
      slug: pageSlug,
      title,
      content, // Store full content locally
      category,
      tags: tagArray,
      updated_at: new Date().toISOString(),
      updated_by: currentUser,
      revision_no: revisionNo
    };

    // Update list metadata cache
    const pageMetadata = { ...localPage };
    delete pageMetadata.content; // Keep list cache light
    if (existingIndex !== -1) {
      pages[existingIndex] = pageMetadata;
    } else {
      pages.push(pageMetadata);
    }
    localStorage.setItem('lawton_wiki_pages', JSON.stringify(pages));
    this._localPages = pages;

    // Save full page content locally
    localStorage.setItem(`lawton_wiki_content_${pageSlug}`, JSON.stringify(localPage));

    // Save local revision history
    const allLocalRevs = JSON.parse(localStorage.getItem('lawton_wiki_revisions') || '{}');
    if (!allLocalRevs[pageSlug]) allLocalRevs[pageSlug] = [];
    allLocalRevs[pageSlug].unshift({
      slug: pageSlug,
      title,
      content,
      updated_at: new Date().toISOString(),
      updated_by: currentUser,
      revision_no: revisionNo
    });
    localStorage.setItem('lawton_wiki_revisions', JSON.stringify(allLocalRevs));

    return localPage;
  },

  /**
   * Delete a page.
   */
  async deletePage(slug) {
    try {
      const res = await api.wiki.delete(slug);
      if (res && res.success) {
        await this.listPages();
        return true;
      }
    } catch (err) {
      console.warn(`Wiki delete page '${slug}' from API failed, removing locally:`, err);
    }

    // Offline delete
    const pages = await this.listPages();
    const filtered = pages.filter(p => p.slug !== slug);
    localStorage.setItem('lawton_wiki_pages', JSON.stringify(filtered));
    this._localPages = filtered;
    localStorage.removeItem(`lawton_wiki_content_${slug}`);

    const allLocalRevs = JSON.parse(localStorage.getItem('lawton_wiki_revisions') || '{}');
    delete allLocalRevs[slug];
    localStorage.setItem('lawton_wiki_revisions', JSON.stringify(allLocalRevs));

    return true;
  },

  /**
   * Parses wiki links [[Page Title]] or [[slug|Label]] in Markdown content.
   */
  parseWikiLinks(content, pages) {
    if (!content) return '';
    const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

    return content.replace(wikiLinkRegex, (match, target, display) => {
      const page = findPageByTarget(target, pages);
      const displayText = (display || target).trim();

      if (page) {
        // Link exists
        return `<a href="#" class="wiki-link" data-slug="${page.slug}">${displayText}</a>`;
      } else {
        // Link unresolved (dashed red style, redirects to page creation)
        const targetTitle = target.trim();
        return `<a href="#" class="wiki-link-unresolved" data-target="${targetTitle}" title="Click to create page '${targetTitle}'">${displayText}</a>`;
      }
    });
  },

  /**
   * Computes which pages link back to the current page.
   */
  getBacklinks(currentSlug, pages) {
    const backlinks = [];
    const normSlug = currentSlug.toLowerCase();
    
    pages.forEach(p => {
      if (p.slug === currentSlug) return;
      
      // Load full content of this page to scan
      const fullPage = this._getFullLocalPage(p.slug);
      const content = fullPage ? fullPage.content : '';
      if (!content) return;

      const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      let match;
      let linksHere = false;

      while ((match = wikiLinkRegex.exec(content)) !== null) {
        const target = match[1];
        const targetSlug = generateSlug(target);
        if (targetSlug === normSlug || target.toLowerCase().trim() === normSlug) {
          linksHere = true;
          break;
        }
      }

      if (linksHere) {
        backlinks.push({
          slug: p.slug,
          title: p.title
        });
      }
    });

    return backlinks;
  },

  // ── PRIVATE HELPERS ──────────────────────────────────────────────────

  /**
   * Fetches the full cached page body in localStorage.
   */
  _getFullLocalPage(slug) {
    const cached = localStorage.getItem(`lawton_wiki_content_${slug}`);
    if (cached) return JSON.parse(cached);

    // If not found in dynamic local storage, check if it's in the initial seed
    const seeded = this._seedFromHandbook();
    const seededPage = seeded.find(p => p.slug === slug);
    return seededPage || null;
  },

  /**
   * Initialize wiki content from rawHandbook JSON structure.
   */
  _seedFromHandbook() {
    const pages = [];
    
    rawHandbook.forEach(item => {
      const content = item.content || '';
      if (!content.trim()) return; // Skip empty folders

      const title = item.title;
      const slug = generateSlug(title);
      
      // Determine clean category based on chapter headers
      let category = 'General';
      if (item.h1) {
        if (item.h1.toLowerCase().includes('training') || item.h1.toLowerCase().includes('culture')) {
          category = 'Culture & Training';
        } else if (item.h1.toLowerCase().includes('policies') || item.h1.toLowerCase().includes('procedure')) {
          category = 'Policies & Laws';
        } else if (item.h1.toLowerCase().includes('emergency') || item.h1.toLowerCase().includes('safety') || item.h1.toLowerCase().includes('health')) {
          category = 'Emergency & Safety';
        } else {
          category = item.h1;
        }
      }

      // Autotag safety content
      const tags = [];
      const text = (title + ' ' + content).toLowerCase();
      if (text.includes('safety') || text.includes('emergency')) tags.push('safety');
      if (text.includes('lightning') || text.includes('weather')) tags.push('weather');
      if (text.includes('bear') || text.includes('wildlife')) tags.push('wildlife');
      if (text.includes('fire')) tags.push('fire');
      if (text.includes('law') || text.includes('reporting') || text.includes('abuse')) tags.push('legal');
      if (text.includes('uniform') || text.includes('expectations')) tags.push('standards');

      const page = {
        slug,
        title,
        content,
        category,
        tags,
        updated_at: new Date().toISOString(),
        updated_by: 'System',
        revision_no: 1
      };

      pages.push(page);
      
      // Save full body cache locally so we don't lose content offline
      localStorage.setItem(`lawton_wiki_content_${slug}`, JSON.stringify(page));
    });

    return pages;
  }
};
