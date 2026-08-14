require("dotenv").config();

const { searchForEvidence } = require("./webSearchService");

async function factCheckClaim(claim) {
  const apiKey = process.env.FACT_CHECK_API_KEY;



  if (!apiKey) {
    console.log("No FACT_CHECK_API_KEY found. Using web search.");
    return await webSearchFallback(claim);
  }

  const url =
    `https://factchecktools.googleapis.com/v1alpha1/claims:search` +
    `?query=${encodeURIComponent(claim)}` +
    `&key=${apiKey}`;

  try {
    const response = await fetch(url);

    const rawBody = await response.text();

    console.log("Fact Check API status:", response.status);
    console.log("Fact Check API body:", rawBody);

    if (!response.ok) {
      console.log("Google Fact Check failed. Using web search fallback.");
      return await webSearchFallback(claim);
    }

    const data = JSON.parse(rawBody);

    const googleResults = (data.claims || []).flatMap((item) =>
      (item.claimReview || []).map((review) => ({
        claim: item.text,
        publisher: review.publisher?.name,
        rating: review.textualRating,
        title: review.title,
        url: review.url,
      }))
    );

    if (googleResults.length > 0) {
      return {
        source: "google_fact_check",
        results: googleResults,
      };
    }

    console.log("No Google Fact Check results. Using web search.");

    return await webSearchFallback(claim);
  } catch (error) {
    console.error("Fact Check API error:", error.message);

    return await webSearchFallback(claim);
  }
}

async function webSearchFallback(claim) {
  try {
    const webResults = await searchForEvidence(claim);

    return {
      source: "web_search",
      results: webResults,
    };
  } catch (error) {
    console.error("Web search fallback failed:", error.message);

    return {
      source: "web_search",
      results: [],
      error: error.message,
    };
  }
}

module.exports = {
  factCheckClaim,
};