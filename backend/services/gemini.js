const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCultureContent(cultureName) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

  const prompt = `Generate a comprehensive, easy-to-understand guide to the subculture of "${cultureName}". Your output must be a JSON object with a "content" key, which is an array of content blocks. Each block should be an object with a "type" ("paragraph", "image", or "video") and "data" (the text for a paragraph, or a URL for an image/video).

  Include the following sections:
  - Common practices and etiquette.
  - In-jokes, memes, and specific humor.
  - Key figures, "legends," or important nodes in the community.
  - Common jargon and terminology.
  - Tips for "getting started" and fitting in.
  - Embed relevant images and videos where appropriate.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON from AI response:", error);
    // Return a default error structure or throw a custom error
    return { content: [{ type: "paragraph", data: "An error occurred while generating content. Please try again." }] };
  }
}

module.exports = { generateCultureContent };
