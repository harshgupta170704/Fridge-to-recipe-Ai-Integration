import { ChefHat, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
      <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-6">
        <ChefHat className="w-10 h-10 text-brand-500" />
      </div>
      <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-3">
        What's in your fridge?
      </h2>
      <p className="text-stone-500 dark:text-stone-400 max-w-sm mb-6 leading-relaxed">
        Tell us what ingredients you have, and we'll create a delicious recipe just for you.
      </p>
      <div className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
        <Sparkles className="w-4 h-4" />
        <span>Powered by AI — results in seconds</span>
      </div>
    </div>
  );
}
