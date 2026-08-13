require("dotenv").config();

const {
  analyzeClaims,
} = require("./claimAnalysisService");

const {
  factCheckClaim,
} = require("./factCheckService");

async function analyzeScan(text) {
  // Step 1: Ask the LLM to analyze the text
  const analysis = await analyzeClaims(text);

  // Step 2: Fact-check every claim
  const claimsWithEvidence = await Promise.all(
    analysis.claims.map(async (claim) => {
      const evidence = await factCheckClaim(claim.claim);

      return {
        ...claim,
        factChecks: evidence,
      };
    })
  );

  return {
    claims: claimsWithEvidence,
  };
}

module.exports = {
  analyzeScan,
};