import mongoose from 'mongoose'

const scheduledVisitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'pending_feedback', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
)

// Index for the notification scheduler — query visits that are past due and notification not sent
scheduledVisitSchema.index({ visitDate: 1, status: 1, notificationSent: 1 })
scheduledVisitSchema.index({ user: 1, status: 1 })

const ScheduledVisit = mongoose.model('ScheduledVisit', scheduledVisitSchema)
export default ScheduledVisit
