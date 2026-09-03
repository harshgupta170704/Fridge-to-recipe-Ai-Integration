import { useState } from 'react';
import { ShoppingBag, Ban, Leaf, Lightbulb, Check, Plus, X } from 'lucide-react';

const EMOJI_MAP = {
  chicken: '🍗', eggs: '🥚', tomato: '🍅', potato: '🥔', onion: '🧅',
  rice: '🍚', paneer: '🧀', fish: '🐟', dal: '🫘', tofu: '🫛',
  chickpeas: '🫘', spinach: '🥬', peas: '🟢', carrot: '🥕',
  mushroom: '🍄', milk: '🥛', butter: '🧈', cheese: '🧀',
  bread: '🍞', pasta: '🍝', oats: '🥣', garlic: '🧄', ginger: '🫚',
};

const getEmoji = (name) => {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return '🥘';
};

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Low-carb', 'Keto', 'Jain',
];

export function FilterPanel({
  selectedIngredients = [],
  excludedItems,       // Set
  onExcludedChange,    // (Set => void)
  dietary = '',        // string
  onDietaryChange,     // (string => void)
}) {
  const [excludeInput, setExcludeInput] = useState('');

  const excludedArray = excludedItems instanceof Set ? [...excludedItems] : [];

  const addExclusion = (val) => {
    const clean = val.trim().toLowerCase();
    if (!clean) return;
    if (!excludedItems.has(clean)) {
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

  const handleExcludeSubmit = (e) => {
    e.preventDefault();
    addExclusion(excludeInput);
  };

  /* Ingredients display — max 5 circles + overflow counter */
  const shown = selectedIngredients.slice(0, 5);
  const overflow = Math.max(0, selectedIngredients.length - 5);

  return (
    <div className="space-y-5 lg:sticky lg:top-24">

      {/* ── Card 1: Your Ingredients ─────────────────────────── */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-[#FF8A4C]" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-[15px]">Your Ingredients</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">{selectedIngredients.length} items selected</p>
          </div>
        </div>

        {selectedIngredients.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {shown.map((item) => (
              <div key={item} title={item}
                className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300
                  font-medium flex items-center justify-center border border-orange-200 dark:border-orange-800 text-base">
                {getEmoji(item)}
              </div>
            ))}
            {overflow > 0 && (
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400
                font-semibold text-xs flex items-center justify-center border border-stone-200 dark:border-stone-700">
                +{overflow}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-stone-400 dark:text-stone-500 italic">No ingredients yet</p>
        )}
      </div>

      {/* ── Card 2: Don't include ────────────────────────────── */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <Ban className="w-4 h-4 text-red-500" />
          </div>
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-[15px]">
            Don't include <span className="text-stone-400 font-normal text-sm">(Optional)</span>
          </h3>
        </div>

        <form onSubmit={handleExcludeSubmit} className="relative mb-3">
          <input
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            placeholder="Add ingredients to exclude..."
            className="w-full h-10 pl-4 pr-11 rounded-xl border border-stone-200 dark:border-stone-700
              bg-stone-50 dark:bg-stone-800/50 text-sm text-stone-700 dark:text-stone-300
              placeholder:text-stone-400 focus:outline-none focus:border-stone-300 dark:focus:border-stone-600 transition-colors"
          />
          <button type="submit" disabled={!excludeInput.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center
              rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700
              text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-40">
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {excludedArray.map((item) => (
            <span key={item}
              className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full bg-white dark:bg-stone-800
                border border-stone-200 dark:border-stone-700 text-sm text-stone-600 dark:text-stone-400 capitalize">
              {item}
              <button onClick={() => removeExclusion(item)} className="p-0.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ── Card 3: Dietary Preference ───────────────────────── */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-[15px]">Dietary Preference</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Select your dietary preference</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((opt) => {
            const isSelected = dietary === opt;
            return (
              <button key={opt}
                onClick={() => onDietaryChange(isSelected ? '' : opt)}
                className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-medium transition-all
                  ${isSelected
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-emerald-300'
                  }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Card 4: Tip ──────────────────────────────────────── */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 p-5">
        <div className="flex gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1 text-[14px]">Tip</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-400/80 leading-relaxed">
              The more ingredients you add, the better recipe suggestions we can give!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
