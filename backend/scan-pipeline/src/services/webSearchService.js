require("dotenv").config();

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";
const MAX_RESULTS = 5;

async function searchForEvidence(claim) {
  if (typeof claim !== "string" || claim.trim().length === 0) {
    throw new Error("A non-empty claim string is required for Tavily search.");
  }

  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured.");
  }

  const response = await fetch(TAVILY_SEARCH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: claim,
      search_depth: "basic",
      max_results: MAX_RESULTS,
      include_answer: false,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily Search API error: ${response.status}`);
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Tavily Search API returned malformed JSON.");
  }

  if (!data || !Array.isArray(data.results)) {
    throw new Error("Tavily Search API returned a malformed response.");
  }

  return data.results.slice(0, MAX_RESULTS).map((result) => ({
    title: typeof result.title === "string" ? result.title : "",
    url: typeof result.url === "string" ? result.url : "",
    snippet: typeof result.content === "string" ? result.content : "",
  }));
}

module.exports = {
  searchForEvidence,
};
