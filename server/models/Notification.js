import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['feedback_reminder', 'visit_reminder', 'general'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedVisit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScheduledVisit',
    },
    relatedRestaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

notificationSchema.index({ user: 1, isRead: 1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
