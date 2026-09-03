import { Info } from 'lucide-react';

const DV = { calories: 2000, protein: 50, carbs: 300, fat: 65 };

function parseG(s) {
  if (!s) return 0;
  const m = String(s).match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

function MacroBar({ emoji, label, value, dv, color }) {
  const n = typeof value === 'number' ? value : parseG(value);
  const pct = dv ? Math.min(Math.round((n / dv) * 100), 100) : 0;
  const display = typeof value === 'number' ? `${value}g` : value || '—';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{emoji}</span>
          <span className="text-[13px] font-medium text-stone-700 dark:text-stone-300">{label}</span>
        </div>
        <span className="text-[13px] font-bold text-stone-800 dark:text-stone-100">
          {display} <span className="text-stone-400 font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function NutritionBadge({ nutrition }) {
  if (!nutrition) return null;
  const { calories, protein, carbs, fat } = nutrition;
  if (!calories && !protein && !carbs && !fat) return null;

  const calPct = calories ? Math.round((calories / DV.calories) * 100) : 0;
  const proteinG = typeof protein === 'number' ? protein : parseG(protein);
  const carbsG = typeof carbs === 'number' ? carbs : parseG(carbs);
  const fatG = typeof fat === 'number' ? fat : parseG(fat);
  const proteinPct = Math.round((proteinG / DV.protein) * 100);
  const carbsPct = Math.round((carbsG / DV.carbs) * 100);
  const fatPct = Math.round((fatG / DV.fat) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          🍽️ Nutrition per serving
        </h3>
        <span className="text-[10px] text-stone-400 flex items-center gap-1">
          <Info className="w-3 h-3" /> AI estimated
        </span>
      </div>

      {/* Calories highlight */}
      <div className="bg-orange-50 dark:bg-orange-950/15 border border-orange-200 dark:border-orange-800/40 rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-0.5">Calories</p>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{calories || '—'} <span className="text-sm font-normal text-stone-500">kcal</span></p>
        </div>
        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">{calPct}% Daily Value</span>
      </div>

      {/* Macro summary grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 dark:bg-blue-950/15 rounded-xl p-3 text-center border border-blue-100 dark:border-blue-900/30">
          <p className="text-[10px] text-blue-600 font-semibold mb-1">Protein</p>
          <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{proteinG}g</p>
          <p className="text-[10px] text-blue-500">{proteinPct}%</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/15 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-900/30">
          <p className="text-[10px] text-emerald-600 font-semibold mb-1">Carbs</p>
          <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{carbsG}g</p>
          <p className="text-[10px] text-emerald-500">{carbsPct}%</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/15 rounded-xl p-3 text-center border border-rose-100 dark:border-rose-900/30">
          <p className="text-[10px] text-rose-600 font-semibold mb-1">Fat</p>
          <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{fatG}g</p>
          <p className="text-[10px] text-rose-500">{fatPct}%</p>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3 pt-1">
        <MacroBar emoji="🥩" label="Protein" value={protein} dv={DV.protein} color="bg-blue-500" />
        <MacroBar emoji="🌿" label="Carbs" value={carbs} dv={DV.carbs} color="bg-emerald-500" />
        <MacroBar emoji="💧" label="Fat" value={fat} dv={DV.fat} color="bg-rose-500" />
      </div>
    </div>
  );
}
