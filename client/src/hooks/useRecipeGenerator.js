import { useState, useRef, useCallback } from 'react';
import { parseRecipeResponse } from '../utils/parseRecipeResponse';
import { validateRecipe } from '../utils/recipeValidator';

const API_BASE = '/api';
const TIMEOUT_MS = 45000; // 45 seconds
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // exponential backoff

/**
 * Core hook for recipe generation and refinement.
 * Handles: API calls, JSON parsing, Zod validation, stale responses,
 * smart retry with prompt mutation, abort/timeout.
 */
export function useRecipeGenerator() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [parseMethod, setParseMethod] = useState(null);

  // Stale response guard
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  /**
   * Generate a new recipe from ingredients.
   */
  const generateRecipe = useCallback(async (ingredients, dietaryPrefs = '') => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const thisRequestId = ++requestIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);
    setWarnings([]);
    setParseMethod(null);

    let lastError = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      // Check if this request is still current
      if (thisRequestId !== requestIdRef.current) return;

      try {
        // Set up timeout
        const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT_MS);

        const response = await fetch(`${API_BASE}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredients,
            dietaryPrefs,
            retryAttempt: attempt,
          }),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        // Check stale
        if (thisRequestId !== requestIdRef.current) return;

        // Handle HTTP errors
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));

          if (response.status === 429) {
            const retryAfter = errorBody.retryAfter || 60;
            throw new Error(`Rate limited. Please wait ${retryAfter} seconds and try again.`);
          }
          if (response.status === 401) {
            throw new Error('API key is invalid. Please check your server configuration.');
          }
          throw new Error(errorBody.error || `Server error (${response.status})`);
        }

        const body = await response.json();

        // Check stale again after parsing
        if (thisRequestId !== requestIdRef.current) return;

        if (!body.data) {
          throw new Error('Server returned an empty response.');
        }

        // Multi-layer JSON parsing
        const { parsed, method, error: parseError } = parseRecipeResponse(body.data);

        if (!parsed) {
          lastError = parseError || 'Could not parse AI response.';
          if (attempt < MAX_RETRIES - 1) {
            await delay(RETRY_DELAYS[attempt]);
            continue; // retry with mutated prompt
          }
          throw new Error(lastError);
        }

        setParseMethod(method);

        // Zod validation
        const validation = validateRecipe(parsed);

        if (validation.success) {
          if (thisRequestId !== requestIdRef.current) return;
          setRecipe(validation.data);
          setWarnings(validation.warnings || []);
          setLoading(false);
          return; // Success!
        }

        // Validation failed but we have partial data
        if (validation.partial) {
          if (thisRequestId !== requestIdRef.current) return;
          setRecipe(validation.partial);
          setWarnings([validation.error]);
          setLoading(false);
          return; // Partial success with warnings
        }

        // Total validation failure
        lastError = validation.error;
        if (attempt < MAX_RETRIES - 1) {
          await delay(RETRY_DELAYS[attempt]);
          continue;
        }
        throw new Error(lastError);

      } catch (err) {
        if (err.name === 'AbortError') {
          if (thisRequestId !== requestIdRef.current) return; // stale abort, ignore
          lastError = 'Request timed out. The AI is taking too long — please try again.';
          if (attempt < MAX_RETRIES - 1) {
            await delay(RETRY_DELAYS[attempt]);
            continue;
          }
        } else {
          lastError = err.message;
          // Don't retry rate limits or auth errors
          if (err.message.includes('Rate limited') || err.message.includes('API key')) {
            break;
          }
          if (attempt < MAX_RETRIES - 1) {
            await delay(RETRY_DELAYS[attempt]);
            continue;
          }
        }
      }
    }

    // All retries exhausted
    if (thisRequestId === requestIdRef.current) {
      setError(lastError || 'Failed to generate recipe after multiple attempts.');
      setLoading(false);
    }
  }, []);

  /**
   * Refine the current recipe with a modification instruction.
   */
  const refineRecipe = useCallback(async (instruction) => {
    if (!recipe) return;

    const thisRequestId = ++requestIdRef.current;
    setRefining(true);
    setError(null);

    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT_MS);

      const response = await fetch(`${API_BASE}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRecipe: recipe,
          instruction,
        }),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (thisRequestId !== requestIdRef.current) return;

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to refine recipe.');
      }

      const body = await response.json();
      if (thisRequestId !== requestIdRef.current) return;

      const { parsed } = parseRecipeResponse(body.data);
      if (!parsed) {
        throw new Error('Could not parse the refined recipe.');
      }

      const validation = validateRecipe(parsed);
      if (validation.success || validation.partial) {
        setRecipe(validation.data || validation.partial);
        setWarnings(validation.warnings || (validation.error ? [validation.error] : []));
      } else {
        throw new Error('The refined recipe was invalid. Your original recipe is preserved.');
      }
    } catch (err) {
      if (thisRequestId === requestIdRef.current) {
        if (err.name === 'AbortError') {
          setError('Refinement timed out. Your original recipe is preserved.');
        } else {
          setError(err.message);
        }
      }
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setRefining(false);
      }
    }
  }, [recipe]);

  /**
   * Clear the current recipe and start fresh.
   */
  const clearRecipe = useCallback(() => {
    requestIdRef.current++; // invalidate any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setRecipe(null);
    setError(null);
    setWarnings([]);
    setLoading(false);
    setRefining(false);
    setParseMethod(null);
  }, []);

  /**
   * Dismiss the current error.
   */
  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    recipe,
    loading,
    refining,
    error,
    warnings,
    parseMethod,
    generateRecipe,
    refineRecipe,
    clearRecipe,
    dismissError,
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
