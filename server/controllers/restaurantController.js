import Restaurant from '../models/Restaurant.js';

// 1. List Restaurants with filters
export const getRestaurants = async (req, res) => {
  try {
    const { 
      category, 
      budgetMin, 
      budgetMax, 
      sortBy, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    
    if (budgetMin || budgetMax) {
      query.priceRange = {};
      if (budgetMin) query['priceRange.min'] = { $gte: Number(budgetMin) };
      if (budgetMax) query['priceRange.max'] = { $lte: Number(budgetMax) };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'rating') sortOptions = { 'rating.average': -1 };
    else if (sortBy === 'priceAsc') sortOptions = { 'priceRange.min': 1 };
    else if (sortBy === 'priceDesc') sortOptions = { 'priceRange.max': -1 };

    const skip = (Number(page) - 1) * Number(limit);
    
    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      data: restaurants,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get Single Restaurant
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Create Restaurant (Admin)
export const createRestaurant = async (req, res) => {
  try {
    const restaurantData = { ...req.body, addedBy: req.user.id };
    const restaurant = await Restaurant.create(restaurantData);
    res.status(201).json({ message: "Restaurant created successfully", restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update Restaurant (Admin)
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete Restaurant (Admin - Soft Delete)
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Add Menu Item (Admin)
export const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.menu.push(req.body);
    await restaurant.save();

    res.status(201).json({ message: "Menu item added", restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Update Menu Item (Admin)
export const updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, "menu._id": req.params.itemId },
      { $set: { "menu.$": { ...req.body, _id: req.params.itemId } } },
      { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant or menu item not found" });
    res.status(200).json({ message: "Menu item updated", restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. Delete Menu Item (Admin)
export const deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $pull: { menu: { _id: req.params.itemId } } },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: "Menu item removed", restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
