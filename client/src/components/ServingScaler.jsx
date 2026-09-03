import { Minus, Plus, Users } from 'lucide-react';

export function ServingScaler({ currentServings, originalServings, onIncrement, onDecrement }) {
  const isScaled = currentServings !== originalServings;

  return (
    <div className="flex items-center gap-3">
      <Users className="w-4 h-4 text-stone-400" />
      <button
        onClick={onDecrement}
        disabled={currentServings <= 1}
        className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center
                   hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200 active:scale-90"
        aria-label="Decrease servings"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className={`font-semibold min-w-[80px] text-center ${
        isScaled ? 'text-brand-600 dark:text-brand-400' : 'text-stone-800 dark:text-stone-200'
      }`}>
        {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
      </span>
      <button
        onClick={onIncrement}
        disabled={currentServings >= 20}
        className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center
                   hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200 active:scale-90"
        aria-label="Increase servings"
      >
        <Plus className="w-4 h-4" />
      </button>
      {isScaled && (
        <span className="text-xs text-stone-400">
          (originally {originalServings})
        </span>
      )}
    </div>
  );
}
