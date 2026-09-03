// Fraction display map
const FRACTION_MAP = [
  { decimal: 0.125, display: '⅛' },
  { decimal: 0.25, display: '¼' },
  { decimal: 0.333, display: '⅓' },
  { decimal: 0.375, display: '⅜' },
  { decimal: 0.5, display: '½' },
  { decimal: 0.625, display: '⅝' },
  { decimal: 0.667, display: '⅔' },
  { decimal: 0.75, display: '¾' },
  { decimal: 0.875, display: '⅞' },
];

// Unit conversion thresholds (for small quantities)
const UNIT_CONVERSIONS = {
  cup: { smallUnit: 'tbsp', factor: 16, threshold: 0.2 },
  cups: { smallUnit: 'tbsp', factor: 16, threshold: 0.2 },
  tbsp: { smallUnit: 'tsp', factor: 3, threshold: 0.5 },
  tablespoon: { smallUnit: 'tsp', factor: 3, threshold: 0.5 },
  tablespoons: { smallUnit: 'tsp', factor: 3, threshold: 0.5 },
};

/**
 * Scale a quantity by the serving ratio and return a display-friendly string.
 * @param {number} originalQty - Original quantity
 * @param {string} unit - Unit of measurement
 * @param {number} originalServings - Original serving count
 * @param {number} currentServings - Current (desired) serving count
 * @returns {{ displayQty: string, displayUnit: string, rawQty: number }}
 */
export function scaleQuantity(originalQty, unit, originalServings, currentServings) {
  if (!originalQty || !originalServings || originalServings <= 0) {
    return { displayQty: String(originalQty || 0), displayUnit: unit, rawQty: originalQty || 0 };
  }

  const ratio = currentServings / originalServings;
  let scaledQty = originalQty * ratio;
  let displayUnit = unit;

  // Check if we should convert to a smaller unit
  const lowerUnit = (unit || '').toLowerCase().trim();
  const conversion = UNIT_CONVERSIONS[lowerUnit];
  if (conversion && scaledQty < conversion.threshold && scaledQty > 0) {
    scaledQty = scaledQty * conversion.factor;
    displayUnit = conversion.smallUnit;
  }

  return {
    displayQty: formatQuantity(scaledQty),
    displayUnit,
    rawQty: scaledQty,
  };
}

/**
 * Format a number as a nice fraction string.
 * Examples: 0.5 -> "½", 1.5 -> "1½", 2.333 -> "2⅓", 3 -> "3"
 */
export function formatQuantity(num) {
  if (num <= 0) return '0';

  const whole = Math.floor(num);
  const fractional = num - whole;

  // If it's basically a whole number
  if (fractional < 0.06) {
    return String(whole);
  }

  // Find closest fraction
  let closestFraction = null;
  let minDiff = Infinity;

  for (const { decimal, display } of FRACTION_MAP) {
    const diff = Math.abs(fractional - decimal);
    if (diff < minDiff) {
      minDiff = diff;
      closestFraction = display;
    }
  }

  // If the closest fraction is close enough (within 0.06)
  if (minDiff < 0.06 && closestFraction) {
    if (whole === 0) return closestFraction;
    return `${whole}${closestFraction}`;
  }

  // Fall back to 1 decimal place
  const rounded = Math.round(num * 10) / 10;
  return String(rounded);
}
