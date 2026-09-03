import { useState, useCallback } from 'react';
import { Moon, Sun, ChefHat } from 'lucide-react';
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

  const handleClearAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const handleGenerate = useCallback(() => {
    if (selectedItems.size === 0) return;
    const ingredients = [...selectedItems].join(', ');
    let prefs = dietary || '';
    if (excludedItems.size > 0) {
      const exclusionStr = `Do NOT use these ingredients: ${[...excludedItems].join(', ')}`;
      prefs = prefs ? `${prefs}. ${exclusionStr}` : exclusionStr;
    }
    setLastIngredients(ingredients);
    setLastDietaryPrefs(prefs);
    generateRecipe(ingredients, prefs);
  }, [selectedItems, dietary, excludedItems, generateRecipe]);

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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* Figma-style Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={recipe ? clearRecipe : undefined}>
              <div className="text-[#FF8A4C]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-stone-800 dark:text-white">
                Fridge<span className="text-[#FF8A4C]">Chef</span>
              </h1>
            </div>
            <div className="hidden sm:block h-6 w-px bg-stone-200 dark:bg-stone-700"></div>
            <p className="hidden sm:block text-sm text-stone-500 dark:text-stone-400 font-medium">
              Turn your fridge into a feast
            </p>
          </div>
          
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-1 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => {if (darkMode) toggleDarkMode();}}
              className={`p-1.5 rounded-full transition-all ${!darkMode ? 'bg-white shadow-sm text-amber-500' : 'text-stone-400 hover:text-stone-300'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => {if (!darkMode) toggleDarkMode();}}
              className={`p-1.5 rounded-full transition-all ${darkMode ? 'bg-stone-700 shadow-sm text-stone-100' : 'text-stone-400 hover:text-stone-500'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 md:py-10 relative">
        {conflictWarning && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2 animate-slide-up z-50">
            <span>⚠️</span> {conflictWarning}
          </div>
        )}

        {!recipe && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-8">
              <IngredientInput
                onGenerate={handleGenerate}
                loading={loading}
                selectedItems={selectedItems}
                onToggleItem={toggleItem}
                onRemoveItem={removeItem}
                onClearAll={handleClearAll}
                dietary={dietary}
                onDietaryChange={handleDietaryChange}
              />
            </div>
            <div className="lg:col-span-4">
              <FilterPanel
                selectedIngredients={selectedArray}
                excludedItems={excludedItems}
                onExcludedChange={setExcludedItems}
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="py-20 flex justify-center">
            <LoadingState />
          </div>
        )}

        {error && (
          <div className="py-12">
            <ErrorState error={error} onRetry={handleRetry} onDismiss={dismissError} />
          </div>
        )}

        {recipe && !loading && (
          <div className="py-4">
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
