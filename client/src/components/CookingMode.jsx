import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, Lightbulb, Check } from 'lucide-react';

export function CookingMode({ steps, timer, onStartTimer, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const step = steps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;
  const isCompleted = completedSteps.has(step?.stepNumber);
  const isTimerActive = timer?.activeStep === step?.stepNumber;

  const goNext = useCallback(() => {
    if (!isLast) setCurrentIndex(i => i + 1);
  }, [isLast]);

  const goPrev = useCallback(() => {
    if (!isFirst) setCurrentIndex(i => i - 1);
  }, [isFirst]);

  const toggleComplete = useCallback(() => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(step.stepNumber)) {
        next.delete(step.stepNumber);
      } else {
        next.add(step.stepNumber);
      }
      return next;
    });
  }, [step?.stepNumber]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleComplete(); }
    if (e.key === 'Escape') onClose();
  }, [goNext, goPrev, toggleComplete, onClose]);

  if (!step) return null;

  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div
      className="fixed inset-0 bg-white dark:bg-stone-900 z-50 flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label="Cooking Mode"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-700">
        <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
          Step {currentIndex + 1} of {steps.length}
        </span>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-4 py-2"
          aria-label="Exit cooking mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-stone-200 dark:bg-stone-700">
        <div
          className="h-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-lg mx-auto text-center">
        {/* Step instruction */}
        <p className={`text-2xl sm:text-3xl font-medium leading-relaxed mb-8 ${
          isCompleted ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-100'
        }`}>
          {step.instruction}
        </p>

        {/* Timer */}
        {step.durationMinutes > 0 && (
          <div className="mb-6">
            {isTimerActive ? (
              <div className="text-center">
                <div className={`text-4xl font-mono font-bold mb-2 ${
                  timer.isComplete ? 'text-emerald-500' : 'text-brand-500'
                }`}>
                  {timer.formattedTime}
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={timer.togglePause}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm"
                  >
                    {timer.isRunning ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={timer.stopTimer}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm"
                  >
                    Stop
                  </button>
                </div>
                {timer.isComplete && (
                  <p className="text-emerald-500 font-medium mt-2">⏰ Time's up!</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => onStartTimer(step.stepNumber, step.durationMinutes)}
                className="inline-flex items-center gap-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 text-lg py-3 px-6"
              >
                <Clock className="w-5 h-5" />
                Start Timer ({step.durationMinutes} min)
              </button>
            )}
          </div>
        )}

        {/* Tip */}
        {step.tip && (
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 rounded-xl px-4 py-3 text-left max-w-sm">
            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{step.tip}</span>
          </div>
        )}

        {/* Complete button */}
        <button
          onClick={toggleComplete}
          className={`mt-8 flex items-center gap-2 py-3 px-6 rounded-xl text-lg font-medium transition-all ${
            isCompleted
              ? 'bg-emerald-500 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
          }`}
        >
          <Check className="w-5 h-5" />
          {isCompleted ? 'Completed!' : 'Mark as Done'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-stone-200 dark:border-stone-700">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 flex items-center gap-2 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-brand-500 w-6'
                  : completedSteps.has(steps[i].stepNumber)
                    ? 'bg-emerald-400'
                    : 'bg-stone-300 dark:bg-stone-600'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          disabled={isLast}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 flex items-center gap-2 disabled:opacity-30"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
