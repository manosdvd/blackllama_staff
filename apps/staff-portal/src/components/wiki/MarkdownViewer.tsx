'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const sanitizeSchema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href || []), 'wiki'],
  },
};

interface MarkdownViewerProps {
  content: string;
  articles: { slug: string }[];
  handleSelectArticle: (slug: string) => void;
  handleTriggerCreateUnresolved: (title: string) => void;
  slugify: (str: string) => string;
}

export default function MarkdownViewer({ 
  content, 
  articles, 
  handleSelectArticle, 
  handleTriggerCreateUnresolved, 
  slugify 
}: MarkdownViewerProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, [rehypeSanitize, sanitizeSchema]]}
      components={{
        a: ({ href, children, ...props }) => {
          const safeHref = typeof href === 'string' ? href : '';
          if (safeHref.startsWith('wiki:')) {
            const targetName = decodeURIComponent(safeHref.replace('wiki:', ''));
            const targetSlug = slugify(targetName);
            if (articles.some((a) => a.slug === targetSlug)) {
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
                title="Click to create"
              >
                {children} ❓
              </button>
            );
          }
          return (
            <a 
              {...props} 
              href={href} 
              className="text-emerald-600 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
