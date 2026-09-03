import { useState } from 'react';
import { Moon, Sun, ChefHat } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [lastIngredients, setLastIngredients] = useState('');
  const [lastDietaryPrefs, setLastDietaryPrefs] = useState('');

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

  const handleGenerate = (ingredients, dietaryPrefs) => {
    setLastIngredients(ingredients);
    setLastDietaryPrefs(dietaryPrefs);
    generateRecipe(ingredients, dietaryPrefs);
  };

  const handleRetry = () => {
    if (lastIngredients) {
      generateRecipe(lastIngredients, lastDietaryPrefs);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-700">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                Fridge to Recipe
              </h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="btn-ghost"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Always show input (collapsed when recipe exists) */}
          {!recipe && !loading && (
            <IngredientInput onGenerate={handleGenerate} loading={loading} />
          )}

          {/* Loading state */}
          {loading && <LoadingState />}

          {/* Error state */}
          {error && (
            <ErrorState
              error={error}
              onRetry={handleRetry}
              onDismiss={dismissError}
            />
          )}

          {/* Empty state (only when no recipe, not loading, no error) */}
          {!recipe && !loading && !error && <EmptyState />}

          {/* Recipe card */}
          {recipe && !loading && (
            <ErrorBoundary>
              <RecipeCard
                recipe={recipe}
                warnings={warnings}
                onRefine={refineRecipe}
                refining={refining}
                onClear={clearRecipe}
              />
            </ErrorBoundary>
          )}
        </main>

        {/* Footer */}
        <footer className="max-w-2xl mx-auto px-4 py-8 text-center text-xs text-stone-400 dark:text-stone-500">
          Built with React + GPT OSS 120B via Groq · Recipes are AI-generated and may need adjustments
        </footer>
      </div>
    </div>
  );
}
