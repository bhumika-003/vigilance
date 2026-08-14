require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeClaims(text) {
  const prompt = `
Extract all potentially verifiable factual claims from the OCR text below.

OCR may contain spelling mistakes, missing words, duplicated words, or distorted text.
Infer the intended wording only when the meaning is clear.

IMPORTANT:
Preserve the COMPLETE meaning and context of each claim.

Do not shorten or oversimplify a factual headline.
Keep important:
- organizations
- people
- locations
- actions
- numbers
- dates
- causes
- relationships
- outcomes
- comparisons
- qualifiers

For example:

OCR:
"SpiceJet laps up overseas routes vacated by Jet Airways, to fly to 7 new cities"

GOOD:
"SpiceJet planned to fly to seven new cities on overseas routes vacated by Jet Airways."

BAD:
"SpiceJet is planning to fly to seven new cities."

The BAD version loses the important context about Jet Airways and the routes.

Include:
- factual statements
- events
- people or organizations
- actions
- numbers
- dates
- outcomes
- factual news headlines

Do NOT include:
- timestamps
- page numbers
- rankings
- section labels
- publication names
- website URLs
- navigation text
- opinions
- ambiguous text

If something is too unclear to confidently determine, do not invent or guess it.

Each independently verifiable claim should be a separate object.

Return ONLY valid JSON in this exact format:

{
  "claims": [
    {
      "claim": "Complete factual claim"
    }
  ]
}

OCR TEXT:
${text}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  let content = response.text.trim();

  console.log("=== GEMINI ANALYSIS ===");
  console.log(content);

  if (content.startsWith("```")) {
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  const parsed = JSON.parse(content);

  return {
    claims: Array.isArray(parsed.claims) ? parsed.claims : [],
  };
}

module.exports = {
  analyzeClaims,
};