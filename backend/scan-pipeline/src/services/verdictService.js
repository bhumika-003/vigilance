require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function evaluateClaim(claim, evidence) {
  const prompt = `
You are a careful fact-checking evaluator for a Media and Information Literacy (MIL) application.

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

---

MIL TACTIC

After evaluating the claim, identify the SINGLE most useful Media and Information Literacy tactic that a user could learn from this claim.

Choose EXACTLY ONE tactic from this list:

- source_sleuth
- evidence_check
- lateral_reading
- context_check
- causation_check
- confirmation_check
- emotion_radar
- persuasion_xray
- framing_check
- data_detective

DO NOT invent another tactic.

The tactic should represent a real verification technique that helps the user independently evaluate similar information in the future.

For the selected tactic provide:

- id: one of the allowed tactic IDs above
- name: a short human-readable name
- description: one short explanation of the technique
- steps: exactly 3 practical steps the user can follow
- whatToLookFor: one short explanation of the warning sign or thing the user should pay attention to

Keep the instructions practical and understandable to a normal app user.

---

Return ONLY valid JSON.

{
  "verdict": "TRUE",
  "confidence": 0.0,
  "reason": "...",
  "evidenceQuality": "HIGH",
  "conflictingEvidence": false,
  "supportingSources": [],
  "milTactic": {
    "id": "source_sleuth",
    "name": "Source Sleuth",
    "description": "Trace a claim back to its original source before trusting it.",
    "steps": [
      "Find the original source.",
      "Check what the source actually says.",
      "Compare it with the claim being shared."
    ],
    "whatToLookFor": "Watch for claims that remove or change the original source's context."
  }
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
      .replace(/^```json\\s*/i, "")
      .replace(/^```\\s*/i, "")
      .replace(/\\s*```$/, "")
      .trim();
  }
console.log("\n=== VERDICT + MIL TACTIC ===");
console.log(content);
  return JSON.parse(content);
}

module.exports = {
  evaluateClaim,
};