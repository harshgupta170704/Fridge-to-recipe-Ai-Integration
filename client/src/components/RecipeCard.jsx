import { useState } from 'react';
import { Clock, ChefHat, Globe, Tag, AlertTriangle, RotateCcw, CookingPot } from 'lucide-react';
import { ServingScaler } from './ServingScaler';
import { IngredientList } from './IngredientList';
import { StepChecklist } from './StepChecklist';
import { NutritionBadge } from './NutritionBadge';
import { RefinementBar } from './RefinementBar';
import { CookingMode } from './CookingMode';
import { useServingScaler } from '../hooks/useServingScaler';
import { useStepTimer } from '../hooks/useStepTimer';

export function RecipeCard({ recipe, warnings, onRefine, refining, onClear }) {
  const [cookingMode, setCookingMode] = useState(false);
  const { currentServings, originalServings, scaledIngredients, increment, decrement } = useServingScaler(recipe);
  const timer = useStepTimer();

  const difficultyColor = {
    Easy: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20',
    Medium: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20',
    Hard: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20',
  };

  return (
    <>
      <div className="card animate-slide-up">
        {/* Warning banner */}
        {warnings && warnings.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800 px-5 py-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700 dark:text-amber-400">
              <span className="font-medium">Some data may be incomplete: </span>
              {warnings.join('; ')}
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                {recipe.title}
              </h2>
              <button
                onClick={onClear}
                className="btn-ghost flex-shrink-0"
                title="Start over"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            {recipe.description && (
              <p className="text-stone-500 dark:text-stone-400 mt-1">{recipe.description}</p>
            )}
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 text-sm">
            {recipe.prepTime && recipe.prepTime !== 'N/A' && (
              <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-700 px-2.5 py-1 rounded-lg text-stone-600 dark:text-stone-300">
                <Clock className="w-3.5 h-3.5" /> {recipe.prepTime} prep
              </span>
            )}
            {recipe.cookTime && recipe.cookTime !== 'N/A' && (
              <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-700 px-2.5 py-1 rounded-lg text-stone-600 dark:text-stone-300">
                <Clock className="w-3.5 h-3.5" /> {recipe.cookTime} cook
              </span>
            )}
            {recipe.difficulty && (
              <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${difficultyColor[recipe.difficulty] || difficultyColor.Medium}`}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.cuisine && (
              <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-700 px-2.5 py-1 rounded-lg text-stone-600 dark:text-stone-300">
                <Globe className="w-3.5 h-3.5" /> {recipe.cuisine}
              </span>
            )}
          </div>

          {/* Nutrition */}
          {recipe.nutrition && <NutritionBadge nutrition={recipe.nutrition} />}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipe.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Servings */}
          <div>
            <h3 className="section-title">Servings</h3>
            <ServingScaler
              currentServings={currentServings}
              originalServings={originalServings}
              onIncrement={increment}
              onDecrement={decrement}
            />
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="section-title">Ingredients</h3>
            <IngredientList ingredients={scaledIngredients} />
          </div>

          {/* Steps */}
          <div>
            <h3 className="section-title">Steps</h3>
            <StepChecklist
              steps={recipe.steps}
              timer={timer}
              onStartTimer={timer.startTimer}
            />
          </div>

          {/* Cooking Mode button */}
          <button
            onClick={() => setCookingMode(true)}
            className="w-full btn-secondary flex items-center justify-center gap-2 py-3 text-base"
          >
            <CookingPot className="w-5 h-5" />
            Start Cooking Mode
          </button>

          {/* Refinement */}
          <div>
            <h3 className="section-title">Refine Recipe</h3>
            <RefinementBar onRefine={onRefine} refining={refining} />
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
