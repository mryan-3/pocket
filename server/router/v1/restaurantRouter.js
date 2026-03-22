import express from 'express';
import { 
  getRestaurants, 
  getRestaurantById, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../../controllers/restaurantController.js';
import { authenticate, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Admin Routes
router.use(authenticate, authorize('admin'));

router.post('/', createRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

router.post('/:id/menu', addMenuItem);
router.put('/:id/menu/:itemId', updateMenuItem);
router.delete('/:id/menu/:itemId', deleteMenuItem);

export default router;
