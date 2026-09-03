import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { generateRecipe, refineRecipe } from "./gemini.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In production, environment variables are set by the host (e.g., Render)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: "../.env" });
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Allow CORS for local development, but in production they are on the same origin
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json());

// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, "../client/dist")));

// Rate limiting: 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a minute before trying again.", retryAfter: 60 },
});
app.use("/api/", limiter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generate recipe
app.post("/api/generate", async (req, res) => {
  try {
    const { ingredients, dietaryPrefs, retryAttempt } = req.body;

    if (!ingredients || typeof ingredients !== "string" || ingredients.trim().length === 0) {
      return res.status(400).json({ error: "Please provide at least one ingredient." });
    }

    if (ingredients.length > 1000) {
      return res.status(400).json({ error: "Input too long. Please keep it under 1000 characters." });
    }

    const responseText = await generateRecipe(
      ingredients.trim(),
      dietaryPrefs || "",
      retryAttempt || 0
    );

    // Send raw text - client will parse and validate
    res.json({ data: responseText });
  } catch (error) {
    console.error("Generate error:", error.message);
    
    if (error.message?.includes("API_KEY") || error.message?.includes("api_key") || error.status === 401) {
      return res.status(401).json({ error: "Invalid API key. Please check your configuration." });
    }
    if (error.message?.includes("SAFETY") || error.message?.includes("content_filter")) {
      return res.status(422).json({ error: "Request was blocked by safety filters. Please try different ingredients." });
    }
    if (error.message?.includes("quota") || error.message?.includes("429") || error.status === 429) {
      return res.status(429).json({ error: "API quota exceeded. Please wait and try again.", retryAfter: 60 });
    }

    res.status(500).json({ error: "Failed to generate recipe. Please try again." });
  }
});

// Refine recipe
app.post("/api/refine", async (req, res) => {
  try {
    const { currentRecipe, instruction } = req.body;

    if (!currentRecipe || !instruction) {
      return res.status(400).json({ error: "Recipe and instruction are required." });
    }

    if (instruction.length > 500) {
      return res.status(400).json({ error: "Instruction too long. Please keep it under 500 characters." });
    }

    const responseText = await refineRecipe(currentRecipe, instruction.trim());
    res.json({ data: responseText });
  } catch (error) {
    console.error("Refine error:", error.message);
    res.status(500).json({ error: "Failed to refine recipe. Please try again." });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// The "catchall" handler: for any request that doesn't
// match an API route above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.warn("WARNING: GROQ_API_KEY is not set. API calls will fail.");
  }
});
