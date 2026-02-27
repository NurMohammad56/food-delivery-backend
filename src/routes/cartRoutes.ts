import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All cart routes are protected (require authentication)
router.use(protect);

router.route('/').get(getCart).delete(clearCart);

router.post('/items', addToCart);
router.put('/items/:menuItemId', updateCartItem);
router.delete('/items/:menuItemId', removeFromCart);

export default router;
