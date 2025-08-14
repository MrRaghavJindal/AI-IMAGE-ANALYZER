import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json({ limit: "15mb" })); // to handle large image uploads
app.use(cors({
  origin: "https://ai-image-analyzer-psi.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// Replace with your actual Gemini API Key
const apiKey = process.env.apiKey;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);

app.post("/analyze-image", async (req, res) => {
  try {
    const { image } = req.body; // image is base64 string from frontend

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Remove base64 header if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Gemini expects pure base64 without data URL prefix
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/png", // or "image/jpeg" depending on frontend
      },
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this image from a YouTube video and provide:

1. A detailed scene description (2-3 sentences describing what's happening)
2. A list of all objects you can identify in the image
3. Your confidence level (0-100) in the analysis

Please format your response as JSON with the following structure:
{
  "sceneDescription": "detailed description of the scene",
  "objects": ["object1", "object2", "object3", ...],
  "confidence": 85
}

Be specific and accurate in your analysis. Focus on visible objects and clear scene elements.`;

    // Send to Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    // Try parsing JSON from Gemini's response
    let analysisResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", parseError);
      analysisResult = {
        sceneDescription: text.substring(0, 500),
        objects: ["Analysis", "Available", "In", "Text", "Format"],
        confidence: 75,
      };
    }

    // Sanitize final result
    const sanitizedResult = {
      sceneDescription:
        analysisResult.sceneDescription || "Unable to analyze scene",
      objects: Array.isArray(analysisResult.objects)
        ? analysisResult.objects.slice(0, 20)
        : ["No objects detected"],
      confidence: Math.min(100, Math.max(0, analysisResult.confidence || 70)),
    };

    res.status(200).json(sanitizedResult);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Analysis failed",
      details: "Please check your API key and try again",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
