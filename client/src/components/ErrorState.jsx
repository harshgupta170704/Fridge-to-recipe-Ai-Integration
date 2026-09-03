import { AlertCircle, RefreshCw, WifiOff, Clock, ShieldAlert } from 'lucide-react';

function getErrorIcon(error) {
  if (error?.includes('timed out') || error?.includes('too long')) return Clock;
  if (error?.includes('Rate limited')) return Clock;
  if (error?.includes('Connection') || error?.includes('network') || error?.includes('fetch')) return WifiOff;
  if (error?.includes('API key') || error?.includes('401')) return ShieldAlert;
  return AlertCircle;
}

export function ErrorState({ error, onRetry, onDismiss }) {
  const Icon = getErrorIcon(error);

  return (
    <div className="card p-6 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
            Recipe generation failed
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
            {error || 'An unknown error occurred.'}
          </p>
          <div className="flex gap-3 mt-4">
            {onRetry && (
              <button onClick={onRetry} className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}
            {onDismiss && (
              <button onClick={onDismiss} className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 px-4 py-2 rounded-lg transition-colors">
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
