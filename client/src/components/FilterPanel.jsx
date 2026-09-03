import { useState, useCallback } from 'react';
import { X, Plus, Ban, Check, Trash2 } from 'lucide-react';

const COMMON_EXCLUSIONS = ['peanuts', 'mushrooms', 'seafood', 'pork', 'beef', 'egg', 'soy', 'gluten', 'spicy'];
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Low-carb', 'Keto', 'Jain'];

export function FilterPanel({ selectedIngredients = [], excludedItems, onExcludedChange, dietary, onDietaryChange, onRemoveIngredient }) {
  const [excludeInput, setExcludeInput] = useState('');

  const addExclusion = useCallback((item) => {
    const clean = item.split('(')[0].trim();
    if (clean && !excludedItems.has(clean)) {
      onExcludedChange(prev => new Set([...prev, clean]));
    }
    setExcludeInput('');
  }, [excludedItems, onExcludedChange]);

  const removeExclusion = useCallback((item) => {
    onExcludedChange(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, [onExcludedChange]);

  const handleExcludeKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (excludeInput.trim()) addExclusion(excludeInput.trim());
    }
  }, [excludeInput, addExclusion]);

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Available Ingredients */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold tracking-tight">Available Ingredients</h3>
          {selectedIngredients.length > 0 && (
            <button
              onClick={() => selectedIngredients.forEach(i => onRemoveIngredient(i))}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="p-4">
          {selectedIngredients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ingredients selected.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 group"
                >
                  {item}
                  <button onClick={() => onRemoveIngredient(item)} className="ml-1 opacity-50 hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exclusions */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold tracking-tight">Exclude from Meal</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={excludeInput}
              onChange={(e) => setExcludeInput(e.target.value)}
              onKeyDown={handleExcludeKeyDown}
              placeholder="e.g., mushrooms..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => excludeInput.trim() && addExclusion(excludeInput.trim())}
              disabled={!excludeInput.trim()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {COMMON_EXCLUSIONS.map((item) => {
              const isExcluded = excludedItems.has(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => isExcluded ? removeExclusion(item) : addExclusion(item)}
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isExcluded
                      ? 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80'
                      : 'border-input bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                  }`}
                >
                  {isExcluded ? 'Excluded' : item}
                </button>
              );
            })}
          </div>

          {excludedItems.size > 0 && (
            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                {[...excludedItems].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  >
                    {item}
                    <button onClick={() => removeExclusion(item)} className="ml-1 opacity-70 hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dietary */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold tracking-tight">Dietary Preference</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onDietaryChange(dietary === opt ? '' : opt)}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  dietary === opt
                    ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'
                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
