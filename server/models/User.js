import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.role !== 'guest'
      },
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'guest'],
      default: 'user',
    },
    preferences: {
      defaultBudgetMin: { type: Number, default: 0 },
      defaultBudgetMax: { type: Number, default: 5000 },
      favoriteCategories: [{ type: String }],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
