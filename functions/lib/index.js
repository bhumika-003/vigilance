"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateBiasMirrorAnswer = exports.generateBiasMirrorRound = void 0;
const generative_ai_1 = require("@google/generative-ai");
const logger = __importStar(require("firebase-functions/logger"));
const https_1 = require("firebase-functions/v2/https");
// The Gemini API key is stored securely on the server, never in the app.
// Set it with: firebase functions:secrets:set GEMINI_API_KEY
const params_1 = require("firebase-functions/params");
const geminiApiKey = (0, params_1.defineSecret)("GEMINI_API_KEY");
/**
 * Generates one round of the Bias Mirror game.
 * Input: { opinion: string } - one of the player's stated opinions/interests.
 * Output: { versionA: string, versionB: string, engineeredVersion: "A" | "B" }
 */
exports.generateBiasMirrorRound = (0, https_1.onCall)({ secrets: [geminiApiKey] }, async (request) => {
    var _a;
    const opinion = (_a = request.data) === null || _a === void 0 ? void 0 : _a.opinion;
    if (!opinion || typeof opinion !== "string") {
        throw new https_1.HttpsError("invalid-argument", "An 'opinion' string is required.");
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey.value());
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
    }
    catch (error) {
        logger.error("generateBiasMirrorRound failed", error);
        throw new https_1.HttpsError("internal", "Failed to generate round.");
    }
});
/**
 * Evaluates the player's answer for a Bias Mirror round.
 * Input: { chosenVersion: "A" | "B", engineeredVersion: "A" | "B", explanation?: string }
 * Output: { correct: boolean, feedback: string }
 */
exports.evaluateBiasMirrorAnswer = (0, https_1.onCall)({ secrets: [geminiApiKey] }, async (request) => {
    const { chosenVersion, engineeredVersion, explanation } = request.data || {};
    if (chosenVersion !== "A" && chosenVersion !== "B") {
        throw new https_1.HttpsError("invalid-argument", "chosenVersion must be 'A' or 'B'.");
    }
    if (engineeredVersion !== "A" && engineeredVersion !== "B") {
        throw new https_1.HttpsError("invalid-argument", "engineeredVersion must be 'A' or 'B'.");
    }
    const correct = chosenVersion === engineeredVersion;
    const genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey.value());
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = `A player in the "Bias Mirror" media-literacy game ${correct ? "correctly" : "incorrectly"} identified which version of a headline was engineered to confirm their existing bias.
${explanation ? `Their explanation was: "${explanation}"` : "They gave no explanation."}

Write a short (2-3 sentence), encouraging explanation of what techniques make a headline
feel "engineered to confirm bias" (loaded adjectives, appeals to authority, social pressure,
cherry-picked framing). Keep it friendly and educational, not preachy.`;
    try {
        const result = await model.generateContent(prompt);
        const feedback = result.response.text().trim();
        return { correct, feedback };
    }
    catch (error) {
        logger.error("evaluateBiasMirrorAnswer failed", error);
        throw new https_1.HttpsError("internal", "Failed to evaluate answer.");
    }
});
//# sourceMappingURL=index.js.map