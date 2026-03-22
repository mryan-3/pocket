import express from 'express';
import { submitFeedback, getRestaurantFeedback, getMyFeedback, deleteFeedback } from '../../controllers/feedbackController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/restaurant/:restaurantId', getRestaurantFeedback);

// Protected Routes
router.use(authenticate);

router.post('/', submitFeedback);
router.get('/me', getMyFeedback);
router.delete('/:id', deleteFeedback);

export default router;
