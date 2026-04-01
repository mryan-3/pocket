import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import ApiResponse from '../utils/ApiResponse.js'

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET || 'access_secret',
    { expiresIn: '15m' },
  )

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: '7d' },
  )

  return { accessToken, refreshToken }
}

// 1. Register Logic
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' })

    const newUser = await User.create({
      name,
      email,
      password, // Model handles hashing
    })

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, 'User registered successfully'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 2. Login Logic
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' })

    const { accessToken, refreshToken } = generateTokens(user)

    // Update refresh token in DB
    user.refreshToken = refreshToken
    await user.save()

    // Set Cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 min
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { id: user._id, name: user.name, role: user.role },
          'Login successful',
        ),
      )
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 3. Logout Logic
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null })
    }
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Logged out successfully'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 4. Refresh Token Logic
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken)
      return res.status(401).json({ message: 'Refresh token missing' })

    const user = await User.findOne({ refreshToken })
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' })

    try {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      )

      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user)

      user.refreshToken = newRefreshToken
      await user.save()

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      })

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Token refreshed'))
    } catch (err) {
      return res
        .status(403)
        .json({ message: 'Invalid or expired refresh token' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 5. Get current user
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json(
      new ApiResponse(200, {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      }),
    )
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
