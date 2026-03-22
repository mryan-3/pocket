import Restaurant from '../models/Restaurant.js';
import { scoreRestaurant } from '../utils/rankingEngine.js';

export const getRecommendations = async (req, res) => {
  try {
    const { budgetMin, budgetMax, category, sortBy } = req.body;

    const query = { isActive: true };
    if (category) query.category = category;
    
    if (budgetMin || budgetMax) {
      query.priceRange = {};
      if (budgetMin) query['priceRange.min'] = { $gte: Number(budgetMin) };
      if (budgetMax) query['priceRange.max'] = { $lte: Number(budgetMax) };
    }

    const restaurants = await Restaurant.find(query);

    // Find max feedback count for popularity calculation
    const maxFeedbackCount = Math.max(...restaurants.map(r => r.rating.count), 0);

    const scoredRestaurants = restaurants.map(restaurant => ({
      ...restaurant.toObject(),
      score: scoreRestaurant(restaurant, maxFeedbackCount)
    }));

    // Sort by score descending by default, or by other criteria
    scoredRestaurants.sort((a, b) => b.score - a.score);

    if (sortBy === 'priceAsc') scoredRestaurants.sort((a, b) => a.priceRange.min - b.priceRange.min);
    else if (sortBy === 'priceDesc') scoredRestaurants.sort((a, b) => b.priceRange.max - a.priceRange.max);
    else if (sortBy === 'rating') scoredRestaurants.sort((a, b) => b.rating.average - a.rating.average);

    res.status(200).json({
      data: scoredRestaurants.slice(0, 10) // Return top 10
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
