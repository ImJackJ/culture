require('dotenv').config();
const { generateCultureContent } = require('../services/gemini');

async function test() {
    console.log("Testing Gemini API...");
    try {
        const result = await generateCultureContent("Goth");
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

test();
