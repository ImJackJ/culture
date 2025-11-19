const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCultureContent(cultureName) {
  // Use the model and configure it for JSON output
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  // This prompt is clearer and specifically designed for JSON mode
  const prompt = `
    You are an expert on subcultures. Generate a JSON object for the subculture "${cultureName}".
    
    The root object must have a "content" key, which is an array of content blocks.
    Each block must be an object with two keys:
    1. "type": A string (must be "paragraph", "image", or "video").
    2. "data": A string.
       - For "paragraph": The text content.
       - For "image": A URL in the format "https://placehold.co/600x400?text=Subject+Name". Replace "Subject+Name" with a short, relevant description of what the image would show (e.g., "Goth+Fashion", "Skate+Park"). Use URL encoding for spaces (e.g., "+").
       - For "video": A URL to a relevant YouTube video embed (e.g., "https://www.youtube.com/embed/dQw4w9WgXcQ"). Try to find a real, relevant video ID if possible, or use a generic one if not sure.

    The content blocks must cover these sections in order:
    - Common practices and etiquette.
    - In-jokes, memes, and specific humor.
    - Key figures, "legends," or important nodes in the community.
    - Common jargon and terminology.
    - Tips for "getting started" and fitting in.

    Use "image" and "video" types where they would be most illustrative.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // This will now be a guaranteed-valid JSON string
    return JSON.parse(text);

  } catch (error) {
    console.error("Error generating or parsing AI response:", error);
    // Fallback to mock content if API fails, so the UI still looks good
    return {
      content: [
        {
          type: "paragraph",
          data: `(AI Generation Failed - Showing Placeholder Content for ${cultureName})`
        },
        {
          type: "paragraph",
          data: `${cultureName} is a fascinating subculture with a rich history and distinct aesthetic. While we couldn't retrieve the live data, here is a glimpse into what makes it unique.`
        },
        {
          type: "image",
          data: `https://placehold.co/600x400?text=${encodeURIComponent(cultureName)}+Aesthetic`
        },
        {
          type: "paragraph",
          data: "Key elements often include specific fashion choices, music genres, and shared values that bind the community together."
        },
        {
          type: "image",
          data: `https://placehold.co/600x400?text=${encodeURIComponent(cultureName)}+Fashion`
        },
        {
          type: "paragraph",
          data: "To get started, look for local meetups or online communities where you can learn more from experienced members."
        }
      ]
    };
  }
}

module.exports = { generateCultureContent };