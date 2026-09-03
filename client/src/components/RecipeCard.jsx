import { useState } from 'react';
import { Clock, ChefHat, Globe, Tag, AlertTriangle, RotateCcw, CookingPot, Utensils } from 'lucide-react';
import { ServingScaler } from './ServingScaler';
import { IngredientList } from './IngredientList';
import { StepChecklist } from './StepChecklist';
import { NutritionBadge } from './NutritionBadge';
import { RefinementBar } from './RefinementBar';
import { CookingMode } from './CookingMode';
import { RecipeResources } from './RecipeResources';
import { useServingScaler } from '../hooks/useServingScaler';
import { useStepTimer } from '../hooks/useStepTimer';

export function RecipeCard({ recipe, warnings, onRefine, refining, onClear }) {
  const [cookingMode, setCookingMode] = useState(false);
  const { currentServings, originalServings, scaledIngredients, increment, decrement } = useServingScaler(recipe);
  const timer = useStepTimer();

  const difficultyColor = {
    Easy: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800',
    Medium: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800',
    Hard: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950/40 border border-red-200 dark:border-red-800',
  };

  return (
    <>
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden animate-slide-up">
        {/* Warning banner for Zod errors */}
        {warnings && warnings.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-800/60 px-5 py-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold block mb-0.5">AI Output Adjusted:</span>
              <span className="opacity-90">{warnings.join('; ')}</span>
            </div>
          </div>
        )}

        {/* Decorative Top Bar */}
        <div className="h-1 w-full bg-[#FF8A4C]"></div>

        <div className="p-5 sm:p-7 space-y-8">
          {/* Header Section */}
          <div className="space-y-4 border-b border-stone-200 dark:border-stone-800 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800 dark:text-stone-100 tracking-tight leading-tight mb-2">
                  {recipe.title}
                </h2>
                {recipe.description && (
                  <p className="text-stone-500 dark:text-stone-400 text-base leading-relaxed max-w-2xl">
                    {recipe.description}
                  </p>
                )}
              </div>
              <button
                onClick={onClear}
                className="inline-flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
                title="Start over"
                aria-label="Start over"
              >
                <RotateCcw className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className={`px-3 py-1.5 rounded-xl text-[13px] font-bold shadow-sm ${difficultyColor[recipe.difficulty] || difficultyColor.Medium}`}>
                {recipe.difficulty || 'Medium'}
              </span>
              
              {(recipe.prepTime && recipe.prepTime !== 'N/A') && (
                <span className="inline-flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm px-3 py-1.5 rounded-xl text-[13px] font-medium text-stone-600 dark:text-stone-300">
                  <Clock className="w-4 h-4 text-orange-500" /> 
                  <span className="text-stone-400 mr-0.5">Prep:</span> {recipe.prepTime}
                </span>
              )}
              
              {(recipe.cookTime && recipe.cookTime !== 'N/A') && (
                <span className="inline-flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm px-3 py-1.5 rounded-xl text-[13px] font-medium text-stone-600 dark:text-stone-300">
                  <CookingPot className="w-4 h-4 text-orange-500" /> 
                  <span className="text-stone-400 mr-0.5">Cook:</span> {recipe.cookTime}
                </span>
              )}
              
              {recipe.cuisine && (
                <span className="inline-flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm px-3 py-1.5 rounded-xl text-[13px] font-medium text-stone-600 dark:text-stone-300">
                  <Globe className="w-4 h-4 text-blue-500" /> {recipe.cuisine}
                </span>
              )}
            </div>
          </div>

          {/* Grid Layout for Nutrition and Servings on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ingredients Side */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                Ingredients
              </h3>
              
              <div className="bg-stone-50 dark:bg-stone-900/50 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="mb-4 pb-4 border-b border-stone-200 dark:border-stone-700">
                  <ServingScaler
                    currentServings={currentServings}
                    originalServings={originalServings}
                    onIncrement={increment}
                    onDecrement={decrement}
                  />
                </div>
                <IngredientList ingredients={scaledIngredients} />
              </div>
            </div>

            {/* Nutrition & Resources Side */}
            <div className="space-y-6">
              {recipe.nutrition && (
                <div className="bg-stone-50 dark:bg-stone-900/50 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <NutritionBadge nutrition={recipe.nutrition} />
                </div>
              )}
              
              <div className="bg-stone-50 dark:bg-stone-900/50 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <RecipeResources recipe={recipe} />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-4">
              <ChefHat className="w-5 h-5 text-orange-500" />
              Instructions
            </h3>
            <div className="bg-stone-50 dark:bg-stone-900/50 p-1 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800">
              <StepChecklist
                steps={recipe.steps}
                timer={timer}
                onStartTimer={timer.startTimer}
              />
            </div>
          </div>

          {/* Cooking Mode button */}
          <div className="pt-2">
            <button
              onClick={() => setCookingMode(true)}
              className="w-full bg-[#FF8A4C] hover:bg-[#FF6D1F] text-white shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <CookingPot className="w-6 h-6" />
              Start Cooking Mode
            </button>
          </div>

          {/* Refinement */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-lg font-semibold text-center text-stone-600 dark:text-stone-400 mb-4">
              Not quite right? Ask AI to tweak it
            </h3>
            <div className="max-w-xl mx-auto">
              <RefinementBar onRefine={onRefine} refining={refining} />
            </div>
          </div>
        </div>
      </div>

      {/* Cooking Mode overlay */}
      {cookingMode && (
        <CookingMode
          steps={recipe.steps}
          timer={timer}
          onStartTimer={timer.startTimer}
          onClose={() => setCookingMode(false)}
        />
      )}
    </>
  );
}
