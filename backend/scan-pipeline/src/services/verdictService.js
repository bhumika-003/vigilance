require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function evaluateClaim(claim, evidence) {
  const prompt = `
You are a careful fact-checking evaluator.

Your job is to evaluate the CLAIM using ONLY the provided EVIDENCE.

CLAIM:
${claim}

EVIDENCE:
${JSON.stringify(evidence, null, 2)}

Rules:

1. Base the verdict on the provided evidence, not on your own memory.
2. Do not invent facts or sources.
3. Distinguish between:
   - Evidence proving that a person made a statement
   - Evidence proving that the statement itself is factually true
4. If credible evidence directly supports the claim, use TRUE.
5. If credible evidence directly contradicts the claim, use FALSE.
6. If the evidence supports only part of the claim, use PARTIALLY_TRUE.
7. If credible sources disagree with each other about the claim, use CONTESTED.
8. If there is not enough reliable evidence to decide, use UNVERIFIABLE.
9. Confidence must reflect the strength and consistency of the evidence.
10. Do not give confidence 1.0 unless the evidence is exceptionally clear and directly establishes the claim.
11. Prefer reliable and authoritative sources when evaluating evidence.
12. Do not treat the number of sources alone as proof of correctness.

Return ONLY valid JSON:

{
  "verdict": "TRUE",
  "confidence": 0.0,
  "reason": "...",
  "evidenceQuality": "HIGH",
  "conflictingEvidence": false,
  "supportingSources": []
}

Allowed verdicts:
- TRUE
- FALSE
- PARTIALLY_TRUE
- CONTESTED
- UNVERIFIABLE

evidenceQuality must be one of:
- HIGH
- MEDIUM
- LOW

conflictingEvidence must be either true or false.

confidence must be a number between 0 and 1.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  let content = response.text.trim();

  if (content.startsWith("```")) {
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  return JSON.parse(content);
}

module.exports = {
  evaluateClaim,
};