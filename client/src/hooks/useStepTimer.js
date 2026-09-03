import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook to manage a countdown timer for a cooking step.
 * @returns {object} - timer state and controls
 */
export function useStepTimer() {
  const [activeStep, setActiveStep] = useState(null); // step number
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = useCallback((stepNumber, durationMinutes) => {
    // Clear existing timer
    if (intervalRef.current) clearInterval(intervalRef.current);

    const totalSeconds = Math.round(durationMinutes * 60);
    setActiveStep(stepNumber);
    setSecondsLeft(totalSeconds);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          // Play a notification sound or vibrate
          try {
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          } catch (e) { /* ignore */ }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setActiveStep(null);
    setSecondsLeft(0);
  }, []);

  const togglePause = useCallback(() => {
    if (isRunning) {
      // Pause
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    } else if (secondsLeft > 0) {
      // Resume
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isRunning, secondsLeft]);

  const formatTime = useCallback((secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  return {
    activeStep,
    secondsLeft,
    isRunning,
    isComplete: activeStep !== null && secondsLeft === 0 && !isRunning,
    formattedTime: formatTime(secondsLeft),
    startTimer,
    stopTimer,
    togglePause,
  };
}
