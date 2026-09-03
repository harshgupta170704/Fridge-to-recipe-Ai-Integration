import { useState, useCallback, useRef } from 'react';
import { Search, Loader2, X, Trash2 } from 'lucide-react';

const QUICK_ADD = [
  { id: 'chicken', label: 'Chicken', emoji: '🍗' },
  { id: 'eggs', label: 'Eggs', emoji: '🥚' },
  { id: 'tomato', label: 'Tomato', emoji: '🍅' },
  { id: 'potato', label: 'Potato', emoji: '🥔' },
  { id: 'onion', label: 'Onion', emoji: '🧅' },
  { id: 'rice', label: 'Rice', emoji: '🍚' },
];

const DIETARY_OPTIONS = [
  { id: 'Vegetarian', label: 'Vegetarian', emoji: '🌿' },
  { id: 'Vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'Gluten-free', label: 'Gluten-free', emoji: '🌾' },
  { id: 'Dairy-free', label: 'Dairy-free', emoji: '🥛' },
  { id: 'Low-carb', label: 'Low-carb', emoji: '🥑' },
  { id: 'Keto', label: 'Keto', emoji: '🥩' },
  { id: 'Jain', label: 'Jain', emoji: '🙏' },
];

export function IngredientInput({ onGenerate, loading, selectedItems, onToggleItem, onRemoveItem, onClearAll, dietary, onDietaryChange }) {
  const [text, setText] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      // Add multiple comma-separated items
      const items = text.split(',').map(s => s.trim()).filter(Boolean);
      items.forEach(item => {
        if (!selectedItems.has(item)) onToggleItem(item);
      });
      setText('');
    } else if (selectedItems.size > 0) {
      onGenerate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const selectedArray = [...selectedItems];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[32px] sm:text-[40px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight flex items-center gap-3">
          What's in your fridge? <span className="text-3xl">🥕</span>
        </h1>
        <p className="text-[15px] text-stone-500 dark:text-stone-400 font-medium">
          Add the ingredients you have, and we'll find delicious recipes for you.
        </p>
      </div>

      {/* Main Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-5 text-stone-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type ingredients e.g., chicken, tomato, onion..."
            className="w-full h-[68px] pl-14 pr-[180px] rounded-2xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 focus:border-[#FF8A4C] dark:focus:border-[#FF8A4C] focus:ring-4 focus:ring-[#FF8A4C]/10 outline-none text-[15px] transition-all"
            disabled={loading}
          />
          <button
            type="button"
            onClick={text.trim() ? handleSubmit : onGenerate}
            disabled={loading || (!text.trim() && selectedItems.size === 0)}
            className="absolute right-3 h-[44px] px-6 bg-gradient-to-r from-[#FF8A4C] to-[#FF6D1F] hover:from-[#FF6D1F] hover:to-[#E86F32] text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-[#FF8A4C]/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SparkleIcon />}
            {text.trim() ? 'Add' : 'Find Recipes'}
          </button>
        </div>
      </form>

      {/* Quick Add */}
      <div className="space-y-4">
        <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100">Quick add</h3>
        <div className="flex flex-wrap gap-3">
          {QUICK_ADD.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className="h-[42px] px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-[#FF8A4C] hover:text-[#FF8A4C] transition-colors flex items-center gap-2 text-[14px] font-medium text-stone-700 dark:text-stone-300 shadow-sm"
            >
              <span>{item.emoji}</span> {item.label}
            </button>
          ))}
          <button 
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="h-[42px] px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-2 text-[14px] font-medium text-stone-600 dark:text-stone-400"
          >
            More {showAllCategories ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Your Fridge (Selected) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100">
            Your fridge <span className="text-stone-500 font-normal">({selectedItems.size})</span>
          </h3>
          {selectedItems.size > 0 && (
            <button onClick={onClearAll} className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
          )}
        </div>
        
        {selectedItems.size === 0 ? (
          <div className="h-[52px] rounded-xl border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center text-sm text-stone-400">
            Your fridge is empty. Add ingredients above!
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {selectedArray.map((item) => (
              <div
                key={item}
                className="h-[44px] pl-4 pr-3 rounded-xl border border-[#FFC8A3] bg-[#FFF1E8] dark:bg-[#FF8A4C]/10 dark:border-[#FF8A4C]/30 flex items-center gap-2 text-[14px] font-medium text-[#C74A00] dark:text-[#FFC8A3]"
              >
                <span className="capitalize">{item}</span>
                <button onClick={() => onRemoveItem(item)} className="p-1 hover:bg-[#FF8A4C]/20 rounded-md transition-colors text-[#FF8A4C]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dietary Preferences */}
      <div className="space-y-4 pt-4">
        <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100">Dietary preferences</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {DIETARY_OPTIONS.map((opt) => {
            const isSelected = dietary === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onDietaryChange(isSelected ? '' : opt.id)}
                className={`relative h-[80px] flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' 
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-emerald-200'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[11px] font-semibold">{opt.label}</span>
                
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
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

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  );
}
