import { useState } from 'react';
import { ArrowRightLeft, Home, ChevronDown, ChevronUp } from 'lucide-react';

export function IngredientList({ ingredients }) {
  const [swapOpen, setSwapOpen] = useState(null);
  const [swapped, setSwapped] = useState({});

  const toggleSwap = (index) => {
    setSwapOpen(swapOpen === index ? null : index);
  };

  const applySwap = (ingredientIndex, swapName) => {
    setSwapped(prev => ({
      ...prev,
      [ingredientIndex]: swapName,
    }));
    setSwapOpen(null);
  };

  const undoSwap = (ingredientIndex) => {
    setSwapped(prev => {
      const next = { ...prev };
      delete next[ingredientIndex];
      return next;
    });
  };

  return (
    <div className="space-y-1">
      {ingredients.map((ing, index) => {
        const displayName = swapped[index] || ing.name;
        const isSwapped = Boolean(swapped[index]);
        const hasSwaps = ing.swapOptions && ing.swapOptions.length > 0;

        return (
          <div key={index} className="group">
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              {/* Quantity and unit */}
              <span className="text-sm font-mono text-brand-600 dark:text-brand-400 min-w-[60px] text-right">
                {ing.displayQty} {ing.displayUnit}
              </span>

              {/* Ingredient name */}
              <span className={`flex-1 ${
                isSwapped ? 'text-brand-600 dark:text-brand-400 italic' : 'text-stone-800 dark:text-stone-200'
              }`}>
                {displayName}
                {isSwapped && (
                  <button
                    onClick={() => undoSwap(index)}
                    className="ml-2 text-xs text-stone-400 hover:text-stone-600 underline"
                  >
                    undo
                  </button>
                )}
              </span>

              {/* From fridge badge */}
              {ing.isFromFridge && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400" title="From your fridge">
                  <Home className="w-3 h-3" />
                </span>
              )}

              {/* Swap button */}
              {hasSwaps && (
                <button
                  onClick={() => toggleSwap(index)}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-brand-500 transition-colors p-1 rounded"
                  aria-label={`Swap options for ${ing.name}`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  {swapOpen === index ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Swap options dropdown */}
            {swapOpen === index && hasSwaps && (
              <div className="ml-16 mb-2 bg-stone-50 dark:bg-stone-800 rounded-lg p-2 space-y-1 animate-fade-in">
                {ing.swapOptions.map((swap, si) => (
                  <button
                    key={si}
                    onClick={() => applySwap(index, swap.name)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-brand-50 dark:hover:bg-brand-900/20
                               text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-between"
                  >
                    <span>🔄 {swap.name}</span>
                    {swap.reason && (
                      <span className="text-xs text-stone-400 ml-2">{swap.reason}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
