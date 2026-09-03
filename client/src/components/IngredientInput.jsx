import { useState, useCallback, useRef, useMemo } from 'react';
import { X, Sparkles, Loader2, ArrowRight } from 'lucide-react';

const INGREDIENT_CATEGORIES = [
  { id: 'protein', label: 'Proteins', emoji: '🥩', items: ['chicken', 'paneer (पनीर)', 'eggs (अंडे)', 'tofu', 'fish', 'dal', 'chickpeas (छोले)'] },
  { id: 'vegetables', label: 'Veggies', emoji: '🥬', items: ['onion', 'tomato', 'potato', 'spinach', 'peas', 'carrot', 'mushroom'] },
  { id: 'dairy', label: 'Dairy', emoji: '🧀', items: ['milk', 'butter', 'cheese', 'curd / yogurt', 'cream'] },
  { id: 'grains', label: 'Grains', emoji: '🌾', items: ['rice', 'wheat flour (आटा)', 'bread', 'pasta', 'oats'] },
  { id: 'spices', label: 'Spices', emoji: '🫙', items: ['garlic', 'ginger', 'chili', 'turmeric', 'cumin', 'garam masala'] },
];

function validateInput(text) {
  if (!text.trim()) return { valid: true, message: '' };
  if (/https?:\/\/|www\./i.test(text)) return { valid: false, message: 'Please enter ingredient names, not URLs' };
  if (/[{}();=<>]/.test(text)) return { valid: false, message: 'Please remove special characters' };
  if (/\b\w{25,}\b/.test(text)) return { valid: false, message: 'Does not look like an ingredient' };
  return { valid: true, message: '' };
}

function parseIngredients(text) {
  return text.split(/[,\n]+|\band\b/i).map(s => s.trim()).filter(s => s.length > 0 && s.length < 60);
}

export function IngredientInput({ onGenerate, loading, selectedItems, onToggleItem, onRemoveItem }) {
  const [text, setText] = useState('');
  const [activeCategory, setActiveCategory] = useState('protein');
  const [validationError, setValidationError] = useState('');
  const textareaRef = useRef(null);

  const typedIngredients = parseIngredients(text);
  const allIngredients = useMemo(() => {
    return [...new Set([...typedIngredients, ...selectedItems])];
  }, [typedIngredients, selectedItems]);

  const handleTextChange = useCallback((e) => {
    const newText = e.target.value.slice(0, 500);
    setText(newText);
    const validation = validateInput(newText);
    setValidationError(validation.valid ? '' : validation.message);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (allIngredients.length === 0 || loading || validationError) return;
    onGenerate(allIngredients.join(', '));
  }, [allIngredients, loading, onGenerate, validationError]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e);
  }, [handleSubmit]);

  const activeCategoryData = INGREDIENT_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight mb-2">What's in your fridge?</h2>
        <p className="text-muted-foreground">Type your ingredients or select from the common items below.</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="ingredients"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g., chicken, garlic, pasta..."
            className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={allIngredients.length === 0 || loading || !!validationError}
            className="absolute bottom-3 right-3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate
          </button>
        </div>
        {validationError && (
          <p className="text-sm font-medium text-destructive">{validationError}</p>
        )}
      </div>

      <div className="space-y-6">
        {INGREDIENT_CATEGORIES.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <span>{cat.emoji}</span> {cat.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => {
                const cleanName = item.split('(')[0].trim().split('/')[0].trim();
                const isSelected = selectedItems.has(cleanName);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onToggleItem(cleanName)}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20' 
                        : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {isSelected && <span className="mr-1.5 text-primary">✓</span>}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
