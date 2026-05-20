import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client to prevent crash if key is initially empty
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI Horology Concierge Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing prompt message" });
    }

    const ai = getGeminiClient();

    // Clean up history to match GoogleGenAI format
    // GoogleGenAI SDK chats system expects: contents: [{ role: 'user', parts: [{ text: ... }]}]
    // Let's use standard generateContent with a luxurious system prompt
    const systemPrompt = `You are AETHERIS Concierge, an elite, ultra-professional, and highly intelligent horology consultant. You are helping clients explore the custom luxury watch brand AETHERIS Chrono. 

AETHERIS creates high-end mechanical skeletonized wristwatches of unprecedented precision. 
We have 4 foundational masterworks:
1. AETHERIS PHANTOM ($185,000): Stealth black aerospace titanium, electric teal glowing cyber conduits, flying Tourbillon AL-7075 caliber.
2. AETHERIS NEBULA ($245,000): Interstellar 18K Rose Gold, amethyst purple forged carbon composites, triple-barrel Cosmic AL-9012 caliber.
3. AETHERIS IMPERIUM ($310,000): Forged 24K Liquid Gold alloy, mirror polished, kinetic micro-rotor automatic Caliber AL-1002, liquid-crystal obsidian dial channels.
4. AETHERIS ZENITH ($395,000): Cryogenic platinum, ice-blue quartz nanocomposite, silicon-carbide magnetic frictionless escapement high frequency Caliber AL-0001.

Speak with extreme elegance, poise, and absolute Swiss horological mastery. Answer questions about automatic winding actions, gears, jewel bearing rubies, escapements, tourbillons orbiting separate axes, or specific water column compression tolerances. Guide clients smoothly on design options, customizations, or secure acquisitions. Do not break character. Keep responses extremely concise (around 2-3 brief sophisticated sentences) so they fit elegant conversational UI boxes.`;

    const chatHistoryParts = history ? history.slice(-6).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    })) : [];

    // Prompt content array
    const contents = [
      ...chatHistoryParts,
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
        maxOutputTokens: 250,
      }
    });

    const reply = response.text || "I apologize, my micro-gears are shifting speeds. How else can I guide you?";
    res.json({ reply });

  } catch (error: any) {
    console.error("Gemini Horology Concierge Critical Error:", error.message || error);
    res.status(500).json({ 
      error: "Conduit error occurred during satellite transmission.",
      details: error.message 
    });
  }
});

// Setup Vite Dev server or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware hooked in Developer mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AETHERIS Luxury Watch Server running on port ${PORT}`);
  });
}

startServer();
