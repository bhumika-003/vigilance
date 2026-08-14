require("dotenv").config();

const {
  analyzeClaims,
} = require("./claimAnalysisService");

const {
  factCheckClaim,
} = require("./factCheckService");

const {
  evaluateClaim,
} = require("./verdictService");

const {
  extractText,
} = require("./ocrService");


async function analyzeScan(imagePath) {

  // Step 1: Extract text from the screenshot using PaddleOCR
  const text = await extractText(imagePath);

  console.log("OCR extracted text:");
  console.log(text);


  // Step 2: Extract factual claims using Gemini
  const analysis = await analyzeClaims(text);

  console.log("\n=== LLM ANALYSIS ===");
  console.log(JSON.stringify(analysis, null, 2));


  // Step 3: Fact-check every claim
  const claimsWithEvidence = await Promise.all(
    analysis.claims.map(async (claim) => {

      console.log("\nFact checking claim:");
      console.log(claim.claim);

      // Get evidence from Google Fact Check API
      // and Web Search fallback
      const evidence = await factCheckClaim(claim.claim);


      // Step 4: Ask Gemini to evaluate the evidence
      const verdict = await evaluateClaim(
        claim.claim,
        evidence.results || []
      );


      // Step 5: Combine claim, evidence, and verdict
      return {
        ...claim,
        factChecks: evidence,
        verdict,
      };
    })
  );


  // Step 6: Return the complete scan result
  return {
    extractedText: text,
    claims: claimsWithEvidence,
  };
}


module.exports = {
  analyzeScan,
};