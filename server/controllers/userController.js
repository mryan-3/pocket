import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import ScheduledVisit from '../models/ScheduledVisit.js';

// 1. Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    // Only allow updating specific fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, preferences } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Feedback History
export const getHistory = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id })
      .populate('restaurant', 'name category priceRange rating')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get Scheduled Visits
export const getVisits = async (req, res) => {
  try {
    const visits = await ScheduledVisit.find({ user: req.user.id })
      .populate('restaurant', 'name location priceRange rating')
      .sort({ visitDate: -1 });
      
    res.status(200).json({ visits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
