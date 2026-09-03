import { useState, useCallback } from 'react';
import { Moon, Sun, UtensilsCrossed, RotateCcw } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { IngredientInput } from './components/IngredientInput';
import { FilterPanel } from './components/FilterPanel';
import { RecipeCard } from './components/RecipeCard';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';

const MEAT_ITEMS = ['chicken', 'fish', 'mutton', 'prawns', 'beef', 'pork', 'seafood'];
const NON_VEGAN_ITEMS = [...MEAT_ITEMS, 'eggs', 'eggs (अंडे)', 'milk', 'butter', 'cheese', 'curd / yogurt', 'cream', 'paneer', 'paneer (पनीर)', 'ghee'];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [lastIngredients, setLastIngredients] = useState('');
  const [lastDietaryPrefs, setLastDietaryPrefs] = useState('');

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [excludedItems, setExcludedItems] = useState(new Set());
  const [dietary, setDietary] = useState('');
  const [conflictWarning, setConflictWarning] = useState('');

  const {
    recipe,
    loading,
    refining,
    error,
    warnings,
    generateRecipe,
    refineRecipe,
    clearRecipe,
    dismissError,
  } = useRecipeGenerator();

  const toggleItem = useCallback((item) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      let newDietary = dietary;
      let warning = '';

      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
        // Check for conflicts with newly added item
        const isMeat = MEAT_ITEMS.some(m => item.toLowerCase().includes(m));
        const isNonVegan = NON_VEGAN_ITEMS.some(m => item.toLowerCase().includes(m));

        if (isMeat && (dietary === 'Vegetarian' || dietary === 'Vegan' || dietary === 'Jain')) {
          newDietary = '';
          warning = `Removed ${dietary} preference because ${item} was added.`;
        } else if (isNonVegan && dietary === 'Vegan') {
          newDietary = '';
          warning = `Removed Vegan preference because ${item} was added.`;
        }
      }

      if (newDietary !== dietary) {
        setDietary(newDietary);
        setConflictWarning(warning);
        setTimeout(() => setConflictWarning(''), 4000);
      }

      return next;
    });
  }, [dietary]);

  const handleDietaryChange = useCallback((newDiet) => {
    setDietary(newDiet);
    setConflictWarning('');

    // If setting a strict diet, remove conflicting ingredients
    if (newDiet === 'Vegetarian' || newDiet === 'Vegan' || newDiet === 'Jain') {
      setSelectedItems(prev => {
        const next = new Set(prev);
        let removed = [];
        for (const item of next) {
          const isMeat = MEAT_ITEMS.some(m => item.toLowerCase().includes(m));
          const isNonVegan = NON_VEGAN_ITEMS.some(m => item.toLowerCase().includes(m));
          
          if (isMeat || (newDiet === 'Vegan' && isNonVegan)) {
            next.delete(item);
            removed.push(item);
          }
        }
        if (removed.length > 0) {
          setConflictWarning(`Removed ${removed.join(', ')} to match ${newDiet} diet.`);
          setTimeout(() => setConflictWarning(''), 4000);
        }
        return next;
      });
    }
  }, []);

  const removeItem = useCallback((item) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, []);

  const handleGenerate = useCallback((ingredients) => {
    let prefs = dietary || '';
    if (excludedItems.size > 0) {
      const exclusionStr = `Do NOT use these ingredients: ${[...excludedItems].join(', ')}`;
      prefs = prefs ? `${prefs}. ${exclusionStr}` : exclusionStr;
    }
    setLastIngredients(ingredients);
    setLastDietaryPrefs(prefs);
    generateRecipe(ingredients, prefs);
  }, [dietary, excludedItems, generateRecipe]);

  const handleRetry = useCallback(() => {
    if (lastIngredients) {
      generateRecipe(lastIngredients, lastDietaryPrefs);
    }
  }, [lastIngredients, lastDietaryPrefs, generateRecipe]);

  const handleClear = useCallback(() => {
    clearRecipe();
    setSelectedItems(new Set());
    setExcludedItems(new Set());
    setDietary('');
  }, [clearRecipe]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const selectedArray = [...selectedItems];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            <h1 className="font-semibold tracking-tight">Fridge to Recipe</h1>
          </div>
          <div className="flex items-center gap-1">
            {recipe && (
              <button 
                onClick={handleClear} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground rounded-md"
              >
                <RotateCcw className="w-4 h-4" /> 
                <span className="hidden sm:inline">New Recipe</span>
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className="inline-flex items-center justify-center w-9 h-9 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground rounded-md"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container - narrower for a focused reading experience */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative">
        {/* Floating Conflict Warning */}
        {conflictWarning && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2 animate-slide-up z-50 border border-amber-200 dark:border-amber-800">
            <span>⚠️</span> {conflictWarning}
          </div>
        )}

        {!recipe && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <IngredientInput
                onGenerate={handleGenerate}
                loading={loading}
                selectedItems={selectedItems}
                onToggleItem={toggleItem}
                onRemoveItem={removeItem}
              />
            </div>
            <div className="lg:col-span-4">
              <FilterPanel
                selectedIngredients={selectedArray}
                excludedItems={excludedItems}
                onExcludedChange={setExcludedItems}
                dietary={dietary}
                onDietaryChange={handleDietaryChange}
                onRemoveIngredient={removeItem}
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="py-12">
            <LoadingState />
          </div>
        )}

        {error && (
          <div className="py-12">
            <ErrorState error={error} onRetry={handleRetry} onDismiss={dismissError} />
          </div>
        )}

        {recipe && !loading && (
          <div className="py-6">
            <ErrorBoundary>
              <RecipeCard
                recipe={recipe}
                warnings={warnings}
                onRefine={refineRecipe}
                refining={refining}
                onClear={handleClear}
              />
            </ErrorBoundary>
          </div>
        )}
      </main>
    </div>
  );
}
