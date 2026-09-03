import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = "openai/gpt-oss-120b";

// JSON schema for structured output guidance (sent in system prompt since
// Groq's strict responseSchema may have compatibility issues with this model)
const RECIPE_SCHEMA_DESCRIPTION = `{
  "title": "string (recipe name)",
  "description": "string (short description)",
  "prepTime": "string (e.g. '10 min')",
  "cookTime": "string (e.g. '20 min')",
  "totalTime": "string (e.g. '30 min')",
  "servings": number (positive integer),
  "difficulty": "Easy" | "Medium" | "Hard",
  "cuisine": "string",
  "ingredients": [
    {
      "name": "string",
      "quantity": number (positive),
      "unit": "string (g, cups, tbsp, etc.)",
      "isFromFridge": boolean,
      "category": "protein" | "vegetable" | "dairy" | "grain" | "spice" | "sauce" | "other",
      "swapOptions": [{ "name": "string", "reason": "string" }]
    }
  ],
  "steps": [
    {
      "stepNumber": number,
      "instruction": "string",
      "durationMinutes": number (0 if N/A),
      "tip": "string (optional helpful tip)"
    }
  ],
  "tags": ["string"],
  "nutrition": {
    "calories": number,
    "protein": "string (e.g. '25g')",
    "carbs": "string (e.g. '40g')",
    "fat": "string (e.g. '15g')"
  }
}`;

const GENERATE_SYSTEM_PROMPT = `You are a professional chef assistant. The user will tell you what ingredients they have in their fridge. Create a practical, delicious recipe using primarily those ingredients.

CRITICAL: You MUST respond with ONLY a valid JSON object. No markdown, no code fences, no explanation — just raw JSON.

The JSON MUST follow this exact schema:
${RECIPE_SCHEMA_DESCRIPTION}

Rules:
- Use mostly the ingredients the user provides
- You may add common pantry staples (salt, pepper, oil, water, basic spices) without asking
- Mark each ingredient with isFromFridge: true if the user mentioned it, false if you added it
- Provide 1-2 realistic swap options for main ingredients with a reason why the swap works
- Steps should be clear, actionable, and include approximate durations in minutes
- Include a helpful tip for any tricky step
- Categorize ingredients as: protein, vegetable, dairy, grain, spice, sauce, or other
- Include estimated nutrition per serving
- Add relevant tags (e.g., quick, vegetarian, budget-friendly, high-protein)

REMEMBER: Output ONLY valid JSON. No other text.`;

const REFINE_SYSTEM_PROMPT = `You are a professional chef assistant. You will receive an existing recipe as JSON and a modification request.
Apply ONLY the requested change. Keep everything else the same as much as possible.

CRITICAL: You MUST respond with ONLY a valid JSON object following the exact same schema as the input recipe. No markdown, no code fences, no explanation — just raw JSON.`;

export async function generateRecipe(ingredients, dietaryPrefs = "", retryAttempt = 0) {
  const temperatureByAttempt = [0.7, 0.3, 0.2];
  const temperature = temperatureByAttempt[Math.min(retryAttempt, 2)];

  let userMessage = `My ingredients: ${ingredients}`;
  if (dietaryPrefs) {
    userMessage += `\nDietary preferences: ${dietaryPrefs}`;
  }
  if (retryAttempt > 0) {
    userMessage += `\nIMPORTANT: Respond with ONLY valid JSON. Ensure all required fields (title, servings, ingredients, steps) are populated.`;
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: GENERATE_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature,
    max_tokens: 4096,
    // Try response_format for JSON mode (may or may not be supported)
    response_format: { type: "json_object" },
  });

  return completion.choices[0]?.message?.content || "";
}

export async function refineRecipe(currentRecipe, instruction) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: REFINE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Current recipe:\n${JSON.stringify(currentRecipe, null, 2)}\n\nModification request: ${instruction}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  return completion.choices[0]?.message?.content || "";
}
