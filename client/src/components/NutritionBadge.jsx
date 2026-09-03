import { Flame, Beef, Wheat, Droplets, Info } from 'lucide-react';

// Approximate daily values for reference
const DAILY_VALUES = {
  calories: 2000,
  protein: 50, // grams
  carbs: 300,  // grams
  fat: 65,     // grams
};

function parseGrams(str) {
  if (!str) return 0;
  const match = String(str).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function NutrientBar({ label, value, unit, dailyValue, icon, color }) {
  const numericValue = typeof value === 'number' ? value : parseGrams(value);
  const percentage = dailyValue ? Math.min(Math.round((numericValue / dailyValue) * 100), 100) : 0;
  const displayValue = typeof value === 'number' ? `${value}${unit}` : value || '—';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`${color}`}>{icon}</span>
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">{label}</span>
        </div>
        <span className="text-xs font-bold text-stone-800 dark:text-stone-100">{displayValue}</span>
      </div>
      {dailyValue > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 70 ? 'bg-red-400' : percentage > 40 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono w-8 text-right">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}

export function NutritionBadge({ nutrition, servings = 1 }) {
  if (!nutrition) return null;

  const { calories, protein, carbs, fat, fiber, sugar, sodium } = nutrition;

  // Check if we have any meaningful data
  const hasData = calories || protein || carbs || fat;
  if (!hasData) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="section-title mb-0">
          📊 Nutrition per serving
        </h3>
        <span className="text-[10px] text-stone-400 dark:text-stone-500 flex items-center gap-1">
          <Info className="w-3 h-3" /> AI estimated
        </span>
      </div>

      {/* Main macros in a grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Calories - highlighted */}
        <div className="col-span-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 
                        border border-amber-200/50 dark:border-amber-800/30 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Calories</p>
              <p className="text-xl font-bold text-amber-800 dark:text-amber-200 leading-tight">
                {calories || '—'}
              </p>
            </div>
          </div>
          {calories && (
            <span className="text-xs text-amber-600/70 dark:text-amber-400/70 font-medium">
              {Math.round((calories / DAILY_VALUES.calories) * 100)}% daily
            </span>
          )}
        </div>

        {/* Protein */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Beef className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Protein</span>
          </div>
          <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{protein || '—'}</p>
        </div>

        {/* Carbs */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Wheat className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Carbs</span>
          </div>
          <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{carbs || '—'}</p>
        </div>

        {/* Fat */}
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Droplets className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">Fat</span>
          </div>
          <p className="text-lg font-bold text-rose-800 dark:text-rose-200">{fat || '—'}</p>
        </div>

        {/* Fiber (if present) */}
        {fiber && (
          <div className="bg-lime-50 dark:bg-lime-950/20 border border-lime-200/50 dark:border-lime-800/30 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">🌿</span>
              <span className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold uppercase tracking-wider">Fiber</span>
            </div>
            <p className="text-lg font-bold text-lime-800 dark:text-lime-200">{fiber}</p>
          </div>
        )}
      </div>

      {/* Daily value breakdown bars */}
      <div className="bg-stone-50 dark:bg-stone-800/30 rounded-2xl p-3 space-y-2.5">
        <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
          % Daily Value
        </p>
        <NutrientBar
          label="Protein"
          value={protein}
          unit="g"
          dailyValue={DAILY_VALUES.protein}
          icon={<Beef className="w-3 h-3" />}
          color="text-blue-500"
        />
        <NutrientBar
          label="Carbs"
          value={carbs}
          unit="g"
          dailyValue={DAILY_VALUES.carbs}
          icon={<Wheat className="w-3 h-3" />}
          color="text-emerald-500"
        />
        <NutrientBar
          label="Fat"
          value={fat}
          unit="g"
          dailyValue={DAILY_VALUES.fat}
          icon={<Droplets className="w-3 h-3" />}
          color="text-rose-500"
        />
      </div>

      <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center italic">
        ⚠️ Nutrition values are AI-estimated and may not be accurate. Consult a nutritionist for dietary advice.
      </p>
    </div>
  );
}
