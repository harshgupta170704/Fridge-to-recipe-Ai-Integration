import { Loader2 } from 'lucide-react';

const loadingMessages = [
  "Finding the perfect recipe...",
  "Checking flavor combinations...",
  "Balancing the ingredients...",
  "Almost ready to cook...",
];

export function LoadingState() {
  const message = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  return (
    <div className="animate-fade-in">
      {/* Loading header */}
      <div className="flex items-center gap-3 mb-6">
        <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
        <span className="text-brand-600 dark:text-brand-400 font-medium">{message}</span>
      </div>

      {/* Skeleton recipe card */}
      <div className="card p-6 space-y-6">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-7 bg-stone-200 dark:bg-stone-700 rounded-lg w-3/4 animate-pulse-soft" />
          <div className="h-4 bg-stone-100 dark:bg-stone-700/50 rounded w-1/2 animate-pulse-soft" />
        </div>

        {/* Meta skeleton */}
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-stone-100 dark:bg-stone-700/50 rounded-lg animate-pulse-soft" />
          ))}
        </div>

        {/* Ingredients skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-stone-200 dark:bg-stone-700 rounded animate-pulse-soft" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-stone-100 dark:bg-stone-700/50 rounded-lg animate-pulse-soft" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Steps skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-stone-200 dark:bg-stone-700 rounded animate-pulse-soft" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-stone-100 dark:bg-stone-700/50 rounded-lg animate-pulse-soft" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
