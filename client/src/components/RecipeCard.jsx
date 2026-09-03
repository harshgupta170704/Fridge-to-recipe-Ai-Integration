import { useState } from 'react';
import { Clock, ChefHat, Globe, AlertTriangle, RotateCcw, CookingPot, Utensils, ArrowLeft, Info, Lightbulb, Minus, Plus, Star, ChevronRight, Zap, Leaf, Flame as FireIcon } from 'lucide-react';
import { NutritionBadge } from './NutritionBadge';
import { RefinementBar } from './RefinementBar';
import { CookingMode } from './CookingMode';
import { RecipeResources } from './RecipeResources';
import { useServingScaler } from '../hooks/useServingScaler';
import { useStepTimer } from '../hooks/useStepTimer';

/* ── Emoji map for ingredients ─────────────────────────── */
const INGR_EMOJI = {
  onion:'🧅', egg:'🥚', butter:'🧈', salt:'🧂', pepper:'🫙',
  parsley:'🌿', chicken:'🍗', tomato:'🍅', rice:'🍚', potato:'🥔',
  garlic:'🧄', ginger:'🫚', oil:'🫒', cream:'🍦', cheese:'🧀',
  paneer:'🧀', milk:'🥛', spinach:'🥬', carrot:'🥕', mushroom:'🍄',
  chili:'🌶️', flour:'🌾', bread:'🍞', sugar:'🍬', lemon:'🍋',
  fish:'🐟', shrimp:'🦐', peas:'🟢', corn:'🌽', cumin:'🫙',
  turmeric:'🟡', cinnamon:'🫙', yogurt:'🥛', curd:'🥛',
};
const getIngredientEmoji = (name) => {
  const l = (name || '').toLowerCase();
  for (const [k, e] of Object.entries(INGR_EMOJI)) {
    if (l.includes(k)) return e;
  }
  return '🥘';
};

export function RecipeCard({ recipe, warnings, onRefine, refining, onClear }) {
  const [cookingMode, setCookingMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeStep, setActiveStep] = useState(0);
  const [rating, setRating] = useState(0);
  const { currentServings, originalServings, scaledIngredients, increment, decrement } = useServingScaler(recipe);
  const timer = useStepTimer();

  const toggleStep = (idx) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const diffBadge = {
    Easy:   'bg-emerald-100 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Hard:   'bg-red-100 text-red-700 border-red-200',
  };

  const steps = recipe.steps || [];

  return (
    <>
      {/* Warning banner */}
      {warnings && warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">AI Output Adjusted: </span>
            <span className="opacity-90">{warnings.join('; ')}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-slide-up">

        {/* ═══════════ LEFT SIDEBAR ═══════════ */}
        <aside className="lg:col-span-2 space-y-5 order-2 lg:order-1">
          {/* Back button */}
          <button onClick={onClear}
            className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to recipes
          </button>

          {/* Steps progress card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-[15px] mb-1">Steps</h3>
            <p className="text-xs text-[#FF8A4C] font-medium mb-4">
              {completedSteps.size} / {steps.length} completed
            </p>
            <div className="space-y-1">
              {steps.map((step, i) => {
                const done = completedSteps.has(i);
                const active = activeStep === i;
                const label = step.instruction?.split('.')[0] || `Step ${i+1}`;
                return (
                  <button key={i} onClick={() => setActiveStep(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-[13px]
                      ${active
                        ? 'bg-orange-50 dark:bg-orange-950/20 text-[#FF8A4C] font-semibold'
                        : done
                          ? 'text-stone-400 line-through'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                      ${active
                        ? 'bg-[#FF8A4C] text-white'
                        : done
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                      }`}>
                      {done ? '✓' : i + 1}
                    </span>
                    <span className="truncate">{label.length > 20 ? label.slice(0, 20) + '…' : label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chef's Tip card */}
          {steps[activeStep]?.tip && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Chef's Tip</h4>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-400/80 leading-relaxed">
                {steps[activeStep].tip}
              </p>
            </div>
          )}

          {/* Refinement suggestions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">You can make it</h4>
            <div className="space-y-2">
              {[
                { emoji: '🌶️', label: 'Spicier', prompt: 'Make it spicier' },
                { emoji: '🥬', label: 'Lighter', prompt: 'Make it lighter and healthier' },
                { emoji: '⚡', label: 'Faster', prompt: 'Make it faster to cook' },
              ].map(({ emoji, label, prompt }) => (
                <button key={label} onClick={() => onRefine(prompt)} disabled={refining}
                  className="flex items-center gap-2.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors disabled:opacity-50">
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
            <button onClick={() => setCookingMode(false)}
              className="w-full h-9 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40
                text-[#FF8A4C] text-sm font-semibold rounded-xl hover:bg-orange-100 transition-colors flex items-center justify-center gap-1.5">
              See suggestions ✨
            </button>
          </div>
        </aside>

        {/* ═══════════ CENTER CONTENT ═══════════ */}
        <main className="lg:col-span-7 space-y-8 order-1 lg:order-2">
          {/* Recipe header */}
          <div className="space-y-4">
            {/* Difficulty badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${diffBadge[recipe.difficulty] || diffBadge.Medium}`}>
              {recipe.difficulty || 'Medium'}
            </span>

            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                <h1 className="text-[28px] sm:text-[34px] font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight mb-3">
                  {recipe.title}
                </h1>
                {recipe.description && (
                  <p className="text-[15px] text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                    {recipe.description}
                  </p>
                )}
                {/* Meta badges */}
                <div className="flex flex-wrap gap-2">
                  {recipe.prepTime && recipe.prepTime !== 'N/A' && (
                    <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[13px] font-medium text-stone-600 dark:text-stone-300">
                      <Clock className="w-3.5 h-3.5 text-stone-400" /> Prep: {recipe.prepTime}
                    </span>
                  )}
                  {recipe.cookTime && recipe.cookTime !== 'N/A' && (
                    <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[13px] font-medium text-stone-600 dark:text-stone-300">
                      <CookingPot className="w-3.5 h-3.5 text-stone-400" /> Cook: {recipe.cookTime}
                    </span>
                  )}
                  {recipe.cuisine && (
                    <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[13px] font-medium text-stone-600 dark:text-stone-300">
                      <Globe className="w-3.5 h-3.5 text-stone-400" /> {recipe.cuisine}
                    </span>
                  )}
                </div>
              </div>

              {/* AI-generated food image */}
              <div className="hidden sm:block relative flex-shrink-0 w-[220px] h-[160px] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm">
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.title + ' delicious plated food meal, professional food photography')}?width=400&height=300&nologo=true`} 
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm dark:bg-stone-900/90 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm border border-stone-200 dark:border-stone-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-200">4.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Ingredients ──────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                🍲 Ingredients
              </h2>
              <div className="flex items-center gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-1 py-1">
                <button onClick={decrement} className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-200 transition-colors">
                  <Minus className="w-3.5 h-3.5 text-stone-500" />
                </button>
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 min-w-[80px] text-center">
                  {currentServings} servings
                </span>
                <button onClick={increment} className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-200 transition-colors">
                  <Plus className="w-3.5 h-3.5 text-stone-500" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              {scaledIngredients.map((ing, i) => (
                <div key={i} className={`flex items-center px-5 py-3.5 gap-4 ${i > 0 ? 'border-t border-stone-100 dark:border-stone-800' : ''}`}>
                  <span className="text-xl w-7 text-center flex-shrink-0">{getIngredientEmoji(ing.name)}</span>
                  <span className="text-sm font-semibold text-[#FF8A4C] min-w-[70px]">
                    {ing.displayQty || ing.quantity} {ing.displayUnit || ing.unit}
                  </span>
                  <span className="text-sm text-stone-700 dark:text-stone-300 flex-1 capitalize">{ing.name}</span>
                  <button className="w-6 h-6 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                    <Info className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Tip bar */}
            {steps[0]?.tip && (
              <div className="bg-orange-50 dark:bg-orange-950/15 border border-orange-200 dark:border-orange-800/40 rounded-xl px-4 py-3 flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#FF8A4C] flex-shrink-0" />
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  <span className="font-semibold">Tip:</span> {steps[0].tip}
                </p>
              </div>
            )}
          </div>

          {/* ── Instructions ─────────────────────────────── */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                👨‍🍳 Instructions
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-stone-500">Check as you cook</span>
                <div className="relative w-10 h-5 bg-stone-200 dark:bg-stone-700 rounded-full transition-colors">
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </label>
            </div>

            <div className="space-y-4">
              {steps.map((step, i) => {
                const done = completedSteps.has(i);
                const title = step.instruction?.split('.')[0] || `Step ${i+1}`;
                const body = step.instruction?.includes('.') ? step.instruction.slice(step.instruction.indexOf('.') + 1).trim() : '';
                return (
                  <div key={i} onClick={() => { toggleStep(i); setActiveStep(i); }}
                    className={`bg-white dark:bg-stone-900 rounded-2xl border p-5 cursor-pointer transition-all
                      ${done
                        ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/10'
                        : 'border-stone-200 dark:border-stone-800 hover:border-orange-200'
                      }`}>
                    <div className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5
                        ${done
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-[#FF8A4C] text-white'
                        }`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className={`font-semibold text-[15px] ${done ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                            {title}.
                          </h3>
                          {step.durationMinutes > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" /> {step.durationMinutes} min
                            </span>
                          )}
                        </div>
                        {body && (
                          <p className={`text-[13px] leading-relaxed ${done ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'}`}>
                            {body}
                          </p>
                        )}
                      </div>
                      {/* Step image */}
                      <div className="hidden sm:block w-[100px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <img 
                          src={`https://image.pollinations.ai/prompt/${encodeURIComponent(title + ' cooking preparation step macro photography')}?width=200&height=144&nologo=true&seed=${i}`}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5">
            <RecipeResources recipe={recipe} />
          </div>
        </main>

        {/* ═══════════ RIGHT SIDEBAR ═══════════ */}
        <aside className="lg:col-span-3 space-y-5 order-3">
          {/* Nutrition card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
            <NutritionBadge nutrition={recipe.nutrition} />
          </div>

          {/* Rating card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">❤️</span>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-[15px]">Loved this recipe?</h3>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
              Give it a rating and help others discover it
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}
                  className="p-0.5 transition-transform hover:scale-110">
                  <Star className={`w-7 h-7 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300 dark:text-stone-600'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Ready to cook CTA */}
          <div className="bg-gradient-to-br from-[#FF8A4C] to-[#E86F32] rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              🍳 Ready to cook?
            </h3>
            <p className="text-sm text-white/80 mb-5 leading-relaxed">
              Start guided cooking mode and follow steps with ease.
            </p>
            <button onClick={() => setCookingMode(true)}
              className="w-full h-11 bg-white/20 hover:bg-white/30 border border-white/30
                rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all">
              🍳 Start Cooking Mode <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Refinement input */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm mb-3">Not quite right?</h3>
            <RefinementBar onRefine={onRefine} refining={refining} />
          </div>
        </aside>
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
