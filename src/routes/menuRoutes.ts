import express from 'express';
import {
  getMenuItems,
  getMenuItem,
  getCategories,
  searchMenuItems
} from '../controllers/menuController';

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/search', searchMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItem);

export default router;
