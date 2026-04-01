import User from '../models/User.js'
import Restaurant from '../models/Restaurant.js'
import Feedback from '../models/Feedback.js'
import ScheduledVisit from '../models/ScheduledVisit.js'
import ApiResponse from '../utils/ApiResponse.js'

// 1. System Stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalRestaurants = await Restaurant.countDocuments()
    const totalFeedback = await Feedback.countDocuments()

    // Simple average rating across all restaurants
    const avgRatingData = await Restaurant.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating.average' } } },
    ])
    const averageRating = avgRatingData.length > 0 ? avgRatingData[0].avg : 0

    return res.status(200).json(new ApiResponse(200, {
      totalUsers,
      totalRestaurants,
      totalFeedback,
      averageRating: Math.round(averageRating * 10) / 10,
    }))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 2. List Users
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const users = await User.find()
      .select('-refreshToken')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    const total = await User.countDocuments()

    return res
      .status(200)
      .json(new ApiResponse(200, { data: users, total, page: Number(page), limit: Number(limit) }))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 3. Get User Detail with History
export const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const feedback = await Feedback.find({ user: user._id }).populate(
      'restaurant',
      'name',
    )
    const visits = await ScheduledVisit.find({ user: user._id }).populate(
      'restaurant',
      'name',
    )

    return res.status(200).json(new ApiResponse(200, { user, feedback, visits }))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 4. Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json(new ApiResponse(200, user, 'User role updated'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 5. Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 6. All Feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
    return res.status(200).json(new ApiResponse(200, feedback))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 7. All Visits
export const getAllVisits = async (req, res) => {
  try {
    const visits = await ScheduledVisit.find()
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .sort({ visitDate: -1 })
    return res.status(200).json(new ApiResponse(200, visits))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
