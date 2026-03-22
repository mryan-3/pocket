import express from 'express'
import {
  register,
  login,
  logout,
  refresh,
  me,
} from '../../controllers/authController.js'
import { authenticate } from '../../middleware/authMiddleware.js'

const router = express.Router()

// Public Routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)

// Protected Routes
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, me)

export default router
