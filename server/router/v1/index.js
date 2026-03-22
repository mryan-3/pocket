import { Router } from 'express'
import { HttpStatusCode } from 'axios'
import authRouter from './authRouter.js'
import userRouter from './userRouter.js'
import restaurantRouter from './restaurantRouter.js'
import recommendationRouter from './recommendationRouter.js'
import visitRouter from './visitRouter.js'
import feedbackRouter from './feedbackRouter.js'
import notificationRouter from './notificationRouter.js'
import adminRouter from './adminRouter.js'

const router = Router()

// Core routes
router.get('/ping', (_, res) => {
  res.status(HttpStatusCode.Ok).json({ message: 'pong', alive: true })
})
router.get('/anything', (_, res) => {
  res
    .status(HttpStatusCode.Ok)
    .json({ message: 'this is anything', alive: true })
})

// Auth routes
router.use('/auth', authRouter)

// User routes
router.use('/users', userRouter)

// Restaurant routes
router.use('/restaurants', restaurantRouter)

// Recommendation routes
router.use('/recommendations', recommendationRouter)

// Visit routes
router.use('/visits', visitRouter)

// Feedback routes
router.use('/feedback', feedbackRouter)

// Notification routes
router.use('/notifications', notificationRouter)

// Admin routes
router.use('/admin', adminRouter)

export default router
