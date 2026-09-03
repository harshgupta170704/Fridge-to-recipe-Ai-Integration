import { useState } from 'react';
import { X, Plus, Ban, Lightbulb, ShoppingBag } from 'lucide-react';

export function FilterPanel({ selectedIngredients = [], excludedItems, onExcludedChange }) {
  const [excludeInput, setExcludeInput] = useState('');

  const addExclusion = (item) => {
    const clean = item.split('(')[0].trim();
    if (clean && !excludedItems.has(clean)) {
      onExcludedChange(prev => new Set([...prev, clean]));
    }
    setExcludeInput('');
  };

  const removeExclusion = (item) => {
    onExcludedChange(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  };

  const handleExcludeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (excludeInput.trim()) addExclusion(excludeInput.trim());
    }
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Your Ingredients Summary Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">Your Ingredients</h3>
            <p className="text-sm text-stone-500">{selectedIngredients.length} items selected</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedIngredients.length === 0 ? (
                <span className="text-stone-300 dark:text-stone-600 text-sm italic">Empty</span>
              ) : (
                selectedIngredients.map((item) => (
                  <div key={item} className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-sm" title={item}>
                    {/* Fake an emoji based on first letter or just show first letter if we don't have a map */}
                    <span className="capitalize">{item.charAt(0)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Don't Include Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500">
            <Ban className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-stone-900 dark:text-stone-100">
            Don't include <span className="text-stone-400 font-normal text-sm ml-1">(Optional)</span>
          </h3>
        </div>

        <div className="relative flex items-center mb-4">
          <input
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyDown={handleExcludeKeyDown}
            placeholder="Add ingredients to exclude..."
            className="w-full h-11 pl-4 pr-10 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 text-sm focus:border-stone-300 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => excludeInput.trim() && addExclusion(excludeInput.trim())}
            disabled={!excludeInput.trim()}
            className="absolute right-2 w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Mushrooms', 'Peanuts', 'Seafood'].map(common => {
            if (excludedItems.has(common.toLowerCase())) return null;
            return (
              <button
                key={common}
                onClick={() => addExclusion(common.toLowerCase())}
                className="h-8 px-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50"
              >
                {common} +
              </button>
            )
          })}
          {[...excludedItems].map((item) => (
            <div
              key={item}
              className="h-8 pl-3 pr-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-xs font-medium text-red-700 dark:text-red-400 flex items-center gap-1"
            >
              <span className="capitalize">{item}</span>
              <button onClick={() => removeExclusion(item)} className="p-1 hover:text-red-900">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tip Card */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-emerald-500 mt-1">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-400 mb-1">Tip</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-500/80 leading-relaxed">
              The more ingredients you add, the better recipe suggestions we can give!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
