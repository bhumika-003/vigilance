import { GoogleGenerativeAI } from "@google/generative-ai";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";

// The Gemini API key is stored securely on the server, never in the app.
// Set it with: firebase functions:secrets:set GEMINI_API_KEY
import { defineSecret } from "firebase-functions/params";
const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * Generates one round of the Bias Mirror game.
 * Input: { opinion: string } - one of the player's stated opinions/interests.
 * Output: { versionA: string, versionB: string, engineeredVersion: "A" | "B" }
 */
export const generateBiasMirrorRound = onCall(
  { secrets: [geminiApiKey] },
  async (request) => {
    const opinion = request.data?.opinion;

    if (!opinion || typeof opinion !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "An 'opinion' string is required."
      );
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey.value());
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are generating a round for a media-literacy game called "Bias Mirror".
The player stated this opinion/preference: "${opinion}"

Write TWO short headline/statement versions about a topic related to this opinion:
- VERSION A: engineered to flatter and confirm the player's existing view, using loaded words, appeals to authority ("experts agree"), or social pressure ("everyone knows").
- VERSION B: neutral, balanced, factual, presenting the topic without flattering either side.

Randomly decide whether Version A or Version B is the "engineered to confirm bias" one, and make sure the OTHER version is the neutral one, but always label them the same way to the player (Version A / Version B is not itself a hint).

Respond ONLY with valid JSON in this exact shape, nothing else:
{
  "versionA": "...",
  "versionB": "...",
  "engineeredVersion": "A" or "B"
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        versionA: parsed.versionA,
        versionB: parsed.versionB,
        engineeredVersion: parsed.engineeredVersion,
      };
    } catch (error) {
      logger.error("generateBiasMirrorRound failed", error);
      throw new HttpsError("internal", "Failed to generate round.");
    }
  }
);

/**
 * Evaluates the player's answer for a Bias Mirror round.
 * Input: { chosenVersion: "A" | "B", engineeredVersion: "A" | "B", explanation?: string }
 * Output: { correct: boolean, feedback: string }
 */
export const evaluateBiasMirrorAnswer = onCall(
  { secrets: [geminiApiKey] },
  async (request) => {
    const { chosenVersion, engineeredVersion, explanation } = request.data || {};

    if (chosenVersion !== "A" && chosenVersion !== "B") {
      throw new HttpsError("invalid-argument", "chosenVersion must be 'A' or 'B'.");
    }
    if (engineeredVersion !== "A" && engineeredVersion !== "B") {
      throw new HttpsError("invalid-argument", "engineeredVersion must be 'A' or 'B'.");
    }

    const correct = chosenVersion === engineeredVersion;

    const genAI = new GoogleGenerativeAI(geminiApiKey.value());
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `A player in the "Bias Mirror" media-literacy game ${
      correct ? "correctly" : "incorrectly"
    } identified which version of a headline was engineered to confirm their existing bias.
${explanation ? `Their explanation was: "${explanation}"` : "They gave no explanation."}

Write a short (2-3 sentence), encouraging explanation of what techniques make a headline
feel "engineered to confirm bias" (loaded adjectives, appeals to authority, social pressure,
cherry-picked framing). Keep it friendly and educational, not preachy.`;

    try {
      const result = await model.generateContent(prompt);
      const feedback = result.response.text().trim();

      return { correct, feedback };
    } catch (error) {
      logger.error("evaluateBiasMirrorAnswer failed", error);
      throw new HttpsError("internal", "Failed to evaluate answer.");
    }
  }
);