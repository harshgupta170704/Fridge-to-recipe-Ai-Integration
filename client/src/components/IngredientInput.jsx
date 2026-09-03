import { useState, useRef } from 'react';
import { Search, Loader2, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

/* ── Emoji map for common ingredients ───────────────────────── */
const EMOJI_MAP = {
  chicken: '🍗', eggs: '🥚', tomato: '🍅', potato: '🥔', onion: '🧅',
  rice: '🍚', paneer: '🧀', fish: '🐟', dal: '🫘', tofu: '🫛',
  chickpeas: '🫘', spinach: '🥬', peas: '🟢', carrot: '🥕',
  mushroom: '🍄', milk: '🥛', butter: '🧈', cheese: '🧀',
  curd: '🥛', cream: '🍦', bread: '🍞', pasta: '🍝', oats: '🥣',
  garlic: '🧄', ginger: '🫚', chili: '🌶️', wheat: '🌾',
};

const getEmoji = (name) => {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return '🥘';
};

/* ── Quick-add ingredients ──────────────────────────────────── */
const QUICK_ADD = [
  { id: 'chicken', label: 'Chicken', emoji: '🍗' },
  { id: 'eggs',    label: 'Eggs',    emoji: '🥚' },
  { id: 'tomato',  label: 'Tomato',  emoji: '🍅' },
  { id: 'potato',  label: 'Potato',  emoji: '🥔' },
  { id: 'onion',   label: 'Onion',   emoji: '🧅' },
  { id: 'rice',    label: 'Rice',    emoji: '🍚' },
];

/* ── All categories (shown when "More" is expanded) ─────────── */
const ALL_CATEGORIES = [
  { label: 'Proteins 🥩',  items: [
    { id: 'chicken', label: 'Chicken', emoji: '🍗' },
    { id: 'paneer',  label: 'Paneer',  emoji: '🧀' },
    { id: 'eggs',    label: 'Eggs',    emoji: '🥚' },
    { id: 'tofu',    label: 'Tofu',    emoji: '🫛' },
    { id: 'fish',    label: 'Fish',    emoji: '🐟' },
    { id: 'dal',     label: 'Dal',     emoji: '🫘' },
    { id: 'chickpeas', label: 'Chickpeas', emoji: '🫘' },
  ]},
  { label: 'Veggies 🥬',  items: [
    { id: 'onion',    label: 'Onion',    emoji: '🧅' },
    { id: 'tomato',   label: 'Tomato',   emoji: '🍅' },
    { id: 'potato',   label: 'Potato',   emoji: '🥔' },
    { id: 'spinach',  label: 'Spinach',  emoji: '🥬' },
    { id: 'peas',     label: 'Peas',     emoji: '🟢' },
    { id: 'carrot',   label: 'Carrot',   emoji: '🥕' },
    { id: 'mushroom', label: 'Mushroom', emoji: '🍄' },
  ]},
  { label: 'Dairy 🧀',    items: [
    { id: 'milk',   label: 'Milk',   emoji: '🥛' },
    { id: 'butter', label: 'Butter', emoji: '🧈' },
    { id: 'cheese', label: 'Cheese', emoji: '🧀' },
    { id: 'curd',   label: 'Curd',   emoji: '🥛' },
    { id: 'cream',  label: 'Cream',  emoji: '🍦' },
  ]},
  { label: 'Grains 🌾',   items: [
    { id: 'rice',  label: 'Rice',  emoji: '🍚' },
    { id: 'bread', label: 'Bread', emoji: '🍞' },
    { id: 'pasta', label: 'Pasta', emoji: '🍝' },
    { id: 'oats',  label: 'Oats',  emoji: '🥣' },
  ]},
  { label: 'Spices 🫙',   items: [
    { id: 'garlic',  label: 'Garlic',  emoji: '🧄' },
    { id: 'ginger',  label: 'Ginger',  emoji: '🫚' },
    { id: 'chili',   label: 'Chili',   emoji: '🌶️' },
    { id: 'turmeric', label: 'Turmeric', emoji: '🟡' },
    { id: 'cumin',   label: 'Cumin',   emoji: '🫙' },
  ]},
];

/* ── Dietary options with tall icon cards ────────────────────── */
const DIETARY_OPTIONS = [
  { id: 'Vegetarian',  label: 'Vegetarian',  emoji: '🌿', icon: '🥬' },
  { id: 'Vegan',       label: 'Vegan',       emoji: '🌱', icon: '🌱' },
  { id: 'Gluten-free', label: 'Gluten-free', emoji: '🌾', icon: '🌾' },
  { id: 'Dairy-free',  label: 'Dairy-free',  emoji: '🥛', icon: '🥛' },
  { id: 'Low-carb',    label: 'Low-carb',    emoji: '🥑', icon: '🥑' },
  { id: 'Keto',        label: 'Keto',        emoji: '🥩', icon: '🥩' },
  { id: 'Jain',        label: 'Jain',        emoji: '🙏', icon: '🙏' },
];


export function IngredientInput({
  onGenerate, loading, selectedItems, onToggleItem,
  onRemoveItem, onClearAll, dietary, onDietaryChange
}) {
  const [text, setText] = useState('');
  const [showMore, setShowMore] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      text.split(',').map(s => s.trim()).filter(Boolean).forEach(item => {
        if (!selectedItems.has(item.toLowerCase())) onToggleItem(item.toLowerCase());
      });
      setText('');
    } else if (selectedItems.size > 0) {
      onGenerate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e); }
  };

  const selectedArray = [...selectedItems];

  return (
    <div className="space-y-8">
      {/* ── Hero heading ─────────────────────────────────────── */}
      <div>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight">
          What's in your fridge? <span className="inline-block">🥕</span>
        </h1>
        <p className="mt-2 text-[15px] text-stone-500 dark:text-stone-400">
          Add the ingredients you have, and we'll find delicious recipes for you.
        </p>
      </div>

      {/* ── Search bar with embedded CTA ─────────────────────── */}
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search className="absolute left-4 sm:left-5 w-5 h-5 text-stone-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type ingredients e.g., chicken, tomato, onion..."
            disabled={loading}
            className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-40 sm:pr-48 rounded-2xl
              border-2 border-stone-200 dark:border-stone-700
              bg-white dark:bg-stone-900
              focus:border-[#FF8A4C] focus:ring-4 focus:ring-[#FF8A4C]/10
              outline-none text-[15px] text-stone-800 dark:text-stone-100
              placeholder:text-stone-400 transition-all"
          />
          <button
            type="button"
            onClick={text.trim() ? handleSubmit : onGenerate}
            disabled={loading || (!text.trim() && selectedItems.size === 0)}
            className="absolute right-2.5 h-10 sm:h-11 px-5 sm:px-7
              bg-[#FF8A4C] hover:bg-[#E86F32] active:bg-[#C74A00]
              disabled:opacity-40 disabled:cursor-not-allowed
              text-white font-semibold text-[14px] sm:text-[15px]
              rounded-xl shadow-md shadow-orange-300/30 dark:shadow-orange-900/30
              transition-all flex items-center gap-2"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <SparkleIcon />
            }
            <span className="whitespace-nowrap">{text.trim() ? 'Add' : 'Find Recipes'}</span>
          </button>
        </div>
      </form>

      {/* ── Quick add row ────────────────────────────────────── */}
      <div>
        <h3 className="text-[13px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
          Quick add
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {QUICK_ADD.map(({ id, label, emoji }) => {
            const active = selectedItems.has(id);
            return (
              <button key={id} onClick={() => onToggleItem(id)}
                className={`h-10 px-4 rounded-xl flex items-center gap-2 text-[13px] font-medium
                  transition-all border shadow-sm
                  ${active
                    ? 'bg-[#FFF1E8] dark:bg-[#FF8A4C]/15 border-[#FFC8A3] dark:border-[#FF8A4C]/40 text-[#C74A00] dark:text-orange-300'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
              >
                <span className="text-base">{emoji}</span>
                {label}
              </button>
            );
          })}
          <button onClick={() => setShowMore(!showMore)}
            className="h-10 px-4 rounded-xl flex items-center gap-1.5 text-[13px] font-medium
              bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700
              text-stone-500 dark:text-stone-400 hover:bg-stone-200/60 transition-colors"
          >
            More {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded categories */}
        {showMore && (
          <div className="mt-5 space-y-5 pt-5 border-t border-stone-100 dark:border-stone-800">
            {ALL_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <h4 className="text-[13px] font-semibold text-stone-400 dark:text-stone-500 mb-2.5">{cat.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(({ id, label, emoji }) => {
                    const active = selectedItems.has(id);
                    return (
                      <button key={id} onClick={() => onToggleItem(id)}
                        className={`h-9 px-3.5 rounded-lg flex items-center gap-1.5 text-[13px] font-medium transition-all border
                          ${active
                            ? 'bg-[#FFF1E8] dark:bg-[#FF8A4C]/15 border-[#FFC8A3] dark:border-[#FF8A4C]/40 text-[#C74A00] dark:text-orange-300'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-orange-200'
                          }`}
                      >
                        <span className="text-sm">{emoji}</span> {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Your fridge (selected items) ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100">
            Your fridge{' '}
            <span className="text-stone-400 font-normal">({selectedItems.size})</span>
          </h3>
          {selectedItems.size > 0 && (
            <button onClick={onClearAll}
              className="flex items-center gap-1 text-[13px] font-semibold text-[#FF8A4C] hover:text-[#E86F32] transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        {selectedItems.size === 0 ? (
          <div className="h-14 rounded-xl border-2 border-dashed border-stone-200 dark:border-stone-700
            flex items-center justify-center text-sm text-stone-400 dark:text-stone-500">
            Your fridge is empty — add ingredients above!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {selectedArray.map((item) => (
              <div key={item}
                className="h-10 pl-3 pr-2.5 rounded-xl border border-[#FFC8A3] dark:border-[#FF8A4C]/30
                  bg-[#FFF1E8] dark:bg-[#FF8A4C]/10
                  flex items-center gap-2 text-[13px] font-medium text-[#C74A00] dark:text-[#FFC8A3]"
              >
                <span className="text-base">{getEmoji(item)}</span>
                <span className="capitalize">{item}</span>
                <button onClick={() => onRemoveItem(item)}
                  className="ml-0.5 p-0.5 rounded-md hover:bg-[#FF8A4C]/20 transition-colors text-[#FF8A4C]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Dietary preferences ───────────────────────────────── */}
      <div>
        <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100 mb-3">
          Dietary preferences
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {DIETARY_OPTIONS.map((opt) => {
            const active = dietary === opt.id;
            return (
              <button key={opt.id}
                onClick={() => onDietaryChange(active ? '' : opt.id)}
                className={`relative flex flex-col items-center justify-center gap-1.5
                  h-[76px] rounded-2xl border-2 transition-all
                  ${active
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-emerald-200/50'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
              >
                <span className="text-[22px]">{opt.icon}</span>
                <span className="text-[11px] font-semibold leading-none">{opt.label}</span>
                {active && (
                  <div className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Sparkle icon (for the CTA button) ────────────────────── */
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
