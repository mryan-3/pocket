import express from 'express';
import { scheduleVisit, getMyVisits, getVisitById, cancelVisit } from '../../controllers/visitController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', scheduleVisit);
router.get('/', getMyVisits);
router.get('/:id', getVisitById);
router.patch('/:id/cancel', cancelVisit);

export default router;
