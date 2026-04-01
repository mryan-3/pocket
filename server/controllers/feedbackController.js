import Feedback from '../models/Feedback.js'
import Restaurant from '../models/Restaurant.js'
import ScheduledVisit from '../models/ScheduledVisit.js'
import mongoose from 'mongoose'
import ApiResponse from '../utils/ApiResponse.js'

// 1. Submit Feedback
export const submitFeedback = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { restaurantId, scheduledVisitId, rating, comment, tags } = req.body

    // Create Feedback
    const feedback = await Feedback.create(
      [
        {
          user: req.user.id,
          restaurant: restaurantId,
          scheduledVisit: scheduledVisitId,
          rating,
          comment,
          tags,
          isVerifiedVisit: !!scheduledVisitId,
        },
      ],
      { session },
    )

    // Update Restaurant Rating
    const restaurant = await Restaurant.findById(restaurantId).session(session)
    if (!restaurant) throw new Error('Restaurant not found')

    const oldAvg = restaurant.rating.average || 0
    const oldCount = restaurant.rating.count || 0
    const newCount = oldCount + 1
    const newAvg = (oldAvg * oldCount + Number(rating)) / newCount

    restaurant.rating.average = newAvg
    restaurant.rating.count = newCount
    await restaurant.save({ session })

    // If tied to a visit, update visit status
    if (scheduledVisitId) {
      const visit =
        await ScheduledVisit.findById(scheduledVisitId).session(session)
      if (visit) {
        visit.status = 'completed'
        await visit.save({ session })
      }
    }

    await session.commitTransaction()
    return res
      .status(201)
      .json(new ApiResponse(201, feedback[0], 'Feedback submitted successfully'))
  } catch (error) {
    await session.abortTransaction()
    res.status(500).json({ error: error.message })
  } finally {
    session.endSession()
  }
}

// 2. Get Restaurant Feedback
export const getRestaurantFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      restaurant: req.params.restaurantId,
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, feedback))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 3. Get My Feedback History
export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id })
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, feedback))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 4. Delete Own Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    })
    if (!feedback)
      return res.status(404).json({ message: 'Feedback not found' })

    // Note: In a real app, we should probably recalculate the restaurant rating here too.
    // But for MVP, let's keep it simple.

    return res.status(200).json(new ApiResponse(200, null, 'Feedback deleted successfully'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
