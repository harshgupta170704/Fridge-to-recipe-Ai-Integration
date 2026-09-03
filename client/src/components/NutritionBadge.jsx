import { Flame } from 'lucide-react';

export function NutritionBadge({ nutrition }) {
  if (!nutrition) return null;

  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {nutrition.calories && (
        <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-lg">
          <Flame className="w-3.5 h-3.5" />
          {nutrition.calories} cal
        </span>
      )}
      {nutrition.protein && (
        <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg">
          🥩 {nutrition.protein}
        </span>
      )}
      {nutrition.carbs && (
        <span className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-lg">
          🌾 {nutrition.carbs}
        </span>
      )}
      {nutrition.fat && (
        <span className="bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-lg">
          🫒 {nutrition.fat}
        </span>
      )}
    </div>
  );
}
