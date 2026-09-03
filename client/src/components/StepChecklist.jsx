import { useState, useCallback } from 'react';
import { Check, Clock, Lightbulb } from 'lucide-react';

export function StepChecklist({ steps, timer, onStartTimer }) {
  const [checked, setChecked] = useState(new Set());

  const toggleStep = useCallback((stepNumber) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  }, []);

  const completedCount = checked.size;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500 dark:text-stone-400">
            {completedCount} of {totalSteps} steps done
          </span>
          {completedCount === totalSteps && totalSteps > 0 && (
            <span className="text-emerald-500 font-medium">🎉 All done!</span>
          )}
        </div>
        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => {
          const isChecked = checked.has(step.stepNumber);
          const isTimerActive = timer?.activeStep === step.stepNumber;

          return (
            <div
              key={step.stepNumber}
              className={`flex gap-3 p-3 rounded-xl transition-all duration-200 ${
                isChecked
                  ? 'bg-emerald-50 dark:bg-emerald-950/20'
                  : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleStep(step.stepNumber)}
                className={`step-checkbox mt-0.5 flex-shrink-0 ${
                  isChecked ? 'checked' : ''
                }`}
                role="checkbox"
                aria-checked={isChecked}
                aria-label={`Step ${step.stepNumber}: ${step.instruction}`}
              >
                {isChecked && <Check className="w-4 h-4 text-white" />}
              </button>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className={`flex items-start gap-2 ${
                  isChecked ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-200'
                }`}>
                  <span className="text-xs font-bold text-stone-400 mt-0.5 flex-shrink-0">
                    {step.stepNumber}.
                  </span>
                  <span className="leading-relaxed">{step.instruction}</span>
                </div>

                {/* Duration badge + timer */}
                {step.durationMinutes > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onStartTimer?.(step.stepNumber, step.durationMinutes)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                        isTimerActive
                          ? 'bg-brand-500 text-white'
                          : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 hover:bg-brand-100 hover:text-brand-600'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {isTimerActive ? timer.formattedTime : `${step.durationMinutes} min`}
                    </button>
                    {isTimerActive && (
                      <button
                        onClick={() => timer.togglePause()}
                        className="text-xs text-stone-400 hover:text-stone-600"
                      >
                        {timer.isRunning ? 'Pause' : 'Resume'}
                      </button>
                    )}
                    {isTimerActive && timer.isComplete && (
                      <span className="text-xs text-emerald-500 font-medium">⏰ Time's up!</span>
                    )}
                  </div>
                )}

                {/* Tip */}
                {step.tip && (
                  <div className="flex items-start gap-1.5 mt-2 text-sm text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{step.tip}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
