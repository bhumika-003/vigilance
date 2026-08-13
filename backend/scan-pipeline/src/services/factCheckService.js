require("dotenv").config();

async function factCheckClaim(claim) {
  const apiKey = process.env.FACT_CHECK_API_KEY;

  const url =
    `https://factchecktools.googleapis.com/v1alpha1/claims:search` +
    `?query=${encodeURIComponent(claim)}` +
    `&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Fact Check API error: ${response.status} ${await response.text()}`
    );
  }

  const data = await response.json();

  if (!data.claims) {
    return [];
  }

  return data.claims.flatMap((item) =>
    (item.claimReview || []).map((review) => ({
      claim: item.text,
      publisher: review.publisher?.name,
      rating: review.textualRating,
      title: review.title,
      url: review.url,
    }))
  );
}

module.exports = {
  factCheckClaim,
};