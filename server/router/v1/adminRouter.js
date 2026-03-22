import express from 'express';
import { 
  getStats, 
  getUsers, 
  getUserDetail, 
  updateUserRole, 
  deleteUser, 
  getAllFeedback, 
  getAllVisits 
} from '../../controllers/adminController.js';
import { authenticate, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/feedback', getAllFeedback);
router.get('/visits', getAllVisits);

export default router;
