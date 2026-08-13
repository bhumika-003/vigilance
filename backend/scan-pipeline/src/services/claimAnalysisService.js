require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function analyzeClaims(text) {
  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b:free",

    messages: [
      {
        role: "system",
        content: `
You are a Media and Information Literacy assistant.

Your job is to help people THINK before they believe or share information.

Analyze the provided text and identify factual claims that can be verified.

For each claim:
1. Give the claim.
2. Give a cautious initial verdict:
   - "needs_verification"
   - "likely_true"
   - "likely_false"
   - "misleading"
3. Explain briefly why the user should investigate it.
4. Give 2-3 practical verification steps.
5. Select ONE fact-checking tactic from:
   - "Lateral Reading"
   - "Source Tracing"
   - "Context Check"
   - "Source Check"
   - "Evidence Check"
   - "Image Verification"
   - "Emotional Check"
   - "Corroboration"

IMPORTANT:
- Do NOT claim something is definitely true or false without evidence.
- The initial verdict is only a preliminary assessment.
- Do NOT invent sources.
- Make the verification steps actionable.
- Make the language engaging and encouraging.
- The goal is to teach the user how to verify information themselves.

Return ONLY valid JSON.
        `,
      },
      {
        role: "user",
        content: text,
      },
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "claim_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            claims: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  claim: {
                    type: "string",
                  },
                  initialVerdict: {
                    type: "string",
                    enum: [
                      "needs_verification",
                      "likely_true",
                      "likely_false",
                      "misleading",
                    ],
                  },
                  reason: {
                    type: "string",
                  },
                  verificationSteps: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  tactic: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                      },
                      explanation: {
                        type: "string",
                      },
                    },
                    required: ["name", "explanation"],
                    additionalProperties: false,
                  },
                },
                required: [
                  "claim",
                  "initialVerdict",
                  "reason",
                  "verificationSteps",
                  "tactic",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["claims"],
          additionalProperties: false,
        },
      },
    },
  });

let content = response.choices[0].message.content.trim();

if (content.startsWith("```")) {
  content = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

const parsed = JSON.parse(content);

if (Array.isArray(parsed)) {
  return {
    claims: parsed,
  };
}

return parsed;
}

module.exports = {
  analyzeClaims,
};