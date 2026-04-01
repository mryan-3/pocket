import ScheduledVisit from '../models/ScheduledVisit.js';
import ApiResponse from '../utils/ApiResponse.js';

// 1. Schedule a Visit
export const scheduleVisit = async (req, res) => {
  try {
    const { restaurantId, visitDate, notes } = req.body;
    
    const visit = await ScheduledVisit.create({
      user: req.user.id,
      restaurant: restaurantId,
      visitDate,
      notes
    });

    return res.status(201).json(new ApiResponse(201, visit, "Visit scheduled successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. List Own Visits
export const getMyVisits = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user.id };
    if (status) query.status = status;

    const visits = await ScheduledVisit.find(query)
      .populate('restaurant', 'name location priceRange')
      .sort({ visitDate: -1 });

    return res.status(200).json(new ApiResponse(200, visits));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Single Visit
export const getVisitById = async (req, res) => {
  try {
    const visit = await ScheduledVisit.findOne({ _id: req.params.id, user: req.user.id })
      .populate('restaurant');
    
    if (!visit) return res.status(404).json({ message: "Visit not found" });
    
    return res.status(200).json(new ApiResponse(200, visit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Cancel Visit
export const cancelVisit = async (req, res) => {
  try {
    const visit = await ScheduledVisit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: 'upcoming' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Upcoming visit not found or already cancelled/completed" });

    return res.status(200).json(new ApiResponse(200, visit, "Visit cancelled successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
