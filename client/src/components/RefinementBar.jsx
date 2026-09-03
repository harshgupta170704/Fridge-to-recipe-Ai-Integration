import { useState, useCallback } from 'react';
import { Wand2, Loader2 } from 'lucide-react';

const QUICK_REFINES = [
  { label: '🌶️ Spicier', instruction: 'Make this recipe spicier with more heat' },
  { label: '🥗 Lighter', instruction: 'Make this recipe lighter and healthier' },
  { label: '⚡ Faster', instruction: 'Simplify and make this recipe faster to cook' },
  { label: '🌱 Vegetarian', instruction: 'Make this recipe vegetarian, replace any meat' },
  { label: '🚫🥛 Dairy-free', instruction: 'Remove all dairy ingredients, suggest substitutes' },
];

export function RefinementBar({ onRefine, refining }) {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!instruction.trim() || refining) return;
    onRefine(instruction.trim());
    setInstruction('');
  }, [instruction, refining, onRefine]);

  const handleQuickRefine = useCallback((quickInstruction) => {
    if (refining) return;
    onRefine(quickInstruction);
  }, [refining, onRefine]);

  return (
    <div className="space-y-3">
      {/* Quick refine buttons */}
      <div className="flex flex-wrap gap-2">
        {QUICK_REFINES.map((qr) => (
          <button
            key={qr.label}
            onClick={() => handleQuickRefine(qr.instruction)}
            disabled={refining}
            className="text-sm py-1.5 px-3 rounded-full border border-stone-300 dark:border-stone-600
                       bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300
                       hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            {qr.label}
          </button>
        ))}
      </div>

      {/* Custom refinement input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g., 'Add more vegetables' or 'Make it kid-friendly'"
          className="input-field flex-1"
          disabled={refining}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!instruction.trim() || refining}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          {refining ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          Refine
        </button>
      </form>
    </div>
  );
}
