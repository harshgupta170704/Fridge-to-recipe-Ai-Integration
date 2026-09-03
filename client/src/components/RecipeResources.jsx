import { ExternalLink, Youtube, BookOpen, Search } from 'lucide-react';

/**
 * Generates smart search URLs for recipe-related resources.
 */
function getYouTubeSearchUrl(title) {
  const query = encodeURIComponent(`${title} recipe tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function getDuckDuckGoVideoUrl(title) {
  const query = encodeURIComponent(`${title} recipe cooking video`);
  return `https://duckduckgo.com/?q=${query}&iax=videos&ia=videos`;
}

function getWikipediaUrl(title, cuisine) {
  // Use the dish name for Wikipedia search, fallback to cuisine
  const query = encodeURIComponent(title.replace(/\s*recipe\s*/i, '').trim());
  return `https://en.wikipedia.org/wiki/Special:Search?search=${query}`;
}

function getDuckDuckGoSearchUrl(title) {
  const query = encodeURIComponent(`${title} recipe`);
  return `https://duckduckgo.com/?q=${query}`;
}

export function RecipeResources({ recipe }) {
  const { title, cuisine, tags } = recipe;

  const links = [
    {
      label: 'Watch on YouTube',
      subtitle: 'Find video tutorials for this dish',
      url: getYouTubeSearchUrl(title),
      icon: <Youtube className="w-5 h-5" />,
      color: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-950/50',
    },
    {
      label: 'Search Videos (DuckDuckGo)',
      subtitle: 'Privacy-friendly video search',
      url: getDuckDuckGoVideoUrl(title),
      icon: <Search className="w-5 h-5" />,
      color: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 dark:hover:bg-orange-950/50',
    },
    {
      label: 'Read on Wikipedia',
      subtitle: `Learn about ${cuisine || 'this dish'}`,
      url: getWikipediaUrl(title, cuisine),
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-950/50',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="section-title">
        🔗 Learn More
      </h3>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all duration-200 group ${link.color}`}
          >
            <div className="flex-shrink-0 bg-white/50 dark:bg-black/20 p-2 rounded-xl">
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight mb-0.5">{link.label}</p>
              <p className="text-xs opacity-80 leading-tight truncate">{link.subtitle}</p>
            </div>
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        ))}
      </div>

      {/* Quick search tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.slice(0, 6).map((tag) => (
            <a
              key={tag}
              href={`https://duckduckgo.com/?q=${encodeURIComponent(tag + ' recipes')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] py-1 px-2.5 rounded-full bg-stone-100 dark:bg-stone-800
                         text-stone-500 dark:text-stone-400 hover:bg-brand-100 hover:text-brand-700
                         dark:hover:bg-brand-950/30 dark:hover:text-brand-300
                         border border-stone-200 dark:border-stone-700 transition-all"
            >
              🔍 {tag}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
