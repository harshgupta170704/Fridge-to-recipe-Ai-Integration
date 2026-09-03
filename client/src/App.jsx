import { useState, useCallback } from 'react';
import { Moon, Sun, ChefHat, RotateCcw } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { IngredientInput } from './components/IngredientInput';
import { FilterPanel } from './components/FilterPanel';
import { RecipeCard } from './components/RecipeCard';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [lastIngredients, setLastIngredients] = useState('');
  const [lastDietaryPrefs, setLastDietaryPrefs] = useState('');

  // Lifted state for ingredients, exclusions, dietary
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [excludedItems, setExcludedItems] = useState(new Set());
  const [dietary, setDietary] = useState('');

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
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }, []);

  const removeItem = useCallback((item) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, []);

  const handleGenerate = useCallback((ingredients) => {
    // Build dietary prefs string including exclusions
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
    <div className="min-h-screen">
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-200">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100 leading-tight">
                  Fridge to Recipe
                </h1>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 font-medium -mt-0.5">
                  AI-Powered Cooking Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {recipe && (
                <button onClick={handleClear} className="btn-ghost flex items-center gap-1.5 text-sm">
                  <RotateCcw className="w-4 h-4" /> New Recipe
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className="btn-ghost"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Input mode: two-column layout */}
          {!recipe && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Input + Categories (2/3 width) */}
              <div className="lg:col-span-2">
                <IngredientInput
                  onGenerate={handleGenerate}
                  loading={loading}
                  selectedItems={selectedItems}
                  onToggleItem={toggleItem}
                  onRemoveItem={removeItem}
                />
              </div>

              {/* Right: Filters sidebar (1/3 width) */}
              <div className="lg:col-span-1">
                <FilterPanel
                  selectedIngredients={selectedArray}
                  excludedItems={excludedItems}
                  onExcludedChange={setExcludedItems}
                  dietary={dietary}
                  onDietaryChange={setDietary}
                  onRemoveIngredient={removeItem}
                />
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="max-w-2xl mx-auto">
              <LoadingState />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="max-w-2xl mx-auto">
              <ErrorState
                error={error}
                onRetry={handleRetry}
                onDismiss={dismissError}
              />
            </div>
          )}

          {/* Recipe card - centered */}
          {recipe && !loading && (
            <div className="max-w-2xl mx-auto">
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

        {/* ── Footer ── */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-stone-400 dark:text-stone-500">
          Built with React + GPT OSS 120B via Groq · Recipes are AI-generated and may need adjustments
        </footer>
      </div>
    </div>
  );
}
