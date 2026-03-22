export const scoreRestaurant = (restaurant, maxFeedbackCount) => {
  const ratingWeight = 0.6;
  const popularityWeight = 0.25;
  const affordabilityWeight = 0.15;

  const ratingScore = (restaurant.rating.average / 5) * 100;
  
  const popularityScore = maxFeedbackCount > 0 
    ? (restaurant.rating.count / maxFeedbackCount) * 100 
    : 0;

  // Affordability: lower price range min = higher score
  // Assuming a max price of 5000 for calculation purposes if not provided
  const maxBudget = 5000;
  const affordabilityScore = Math.max(0, (1 - (restaurant.priceRange.min / maxBudget)) * 100);

  const finalScore = (ratingScore * ratingWeight) + 
                     (popularityScore * popularityWeight) + 
                     (affordabilityScore * affordabilityWeight);

  return Math.round(finalScore);
};
