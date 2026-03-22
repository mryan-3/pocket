import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
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
    scheduledVisit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScheduledVisit',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    tags: [{ type: String }], // e.g. ["affordable", "great portions", "slow service"]
    isVerifiedVisit: {
      // true if tied to a completed scheduled visit
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Prevent duplicate feedback per user per restaurant per visit
feedbackSchema.index(
  { user: 1, restaurant: 1, scheduledVisit: 1 },
  { unique: true, sparse: true },
)

const Feedback = mongoose.model('Feedback', feedbackSchema)
export default Feedback
