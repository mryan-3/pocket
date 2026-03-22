import express from 'express';
import { getProfile, updateProfile, getHistory, getVisits } from '../../controllers/userController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate); // All routes in this router are protected

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/history', getHistory);
router.get('/visits', getVisits);

export default router;
