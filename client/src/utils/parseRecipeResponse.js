/**
 * Multi-layer JSON extraction from AI response.
 * Handles: raw JSON, code-fenced JSON, brace-extracted JSON, and partial recovery.
 * 
 * @param {string} responseText - Raw text from the AI response
 * @returns {{ parsed: object|null, method: string, error: string|null }}
 */
export function parseRecipeResponse(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    return { parsed: null, method: 'none', error: 'Empty or invalid response' };
  }

  const text = responseText.trim();

  // Layer 1: Direct JSON.parse
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      return { parsed, method: 'direct', error: null };
    }
  } catch (e) {
    // Fall through to next layer
  }

  // Layer 2: Extract from code fences (```json ... ``` or ``` ... ```)
  const codeFenceRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?```/;
  const codeFenceMatch = text.match(codeFenceRegex);
  if (codeFenceMatch) {
    try {
      const parsed = JSON.parse(codeFenceMatch[1].trim());
      if (typeof parsed === 'object' && parsed !== null) {
        return { parsed, method: 'code-fence', error: null };
      }
    } catch (e) {
      // Fall through
    }
  }

  // Layer 3: Brace extraction — find outermost { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      const extracted = text.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(extracted);
      if (typeof parsed === 'object' && parsed !== null) {
        return { parsed, method: 'brace-extraction', error: null };
      }
    } catch (e) {
      // Fall through
    }
  }

  // Layer 4: Try to fix common JSON issues
  try {
    // Remove trailing commas before } or ]
    let fixed = text.replace(/,\s*([}\]])/g, '$1');
    // Remove single-line comments
    fixed = fixed.replace(/\/\/.*$/gm, '');
    // Try brace extraction on fixed text
    const fb = fixed.indexOf('{');
    const lb = fixed.lastIndexOf('}');
    if (fb !== -1 && lb > fb) {
      const parsed = JSON.parse(fixed.substring(fb, lb + 1));
      if (typeof parsed === 'object' && parsed !== null) {
        return { parsed, method: 'fixed-json', error: null };
      }
    }
  } catch (e) {
    // Fall through
  }

  // All layers failed
  return {
    parsed: null,
    method: 'none',
    error: 'Could not extract valid JSON from the AI response. The model may have returned an unexpected format.',
  };
}
