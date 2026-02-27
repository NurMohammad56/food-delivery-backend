import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';
import Category from '../models/Category';

// @desc    Get all menu items with filters
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      isAvailable,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const menuItems = await MenuItem.find(query)
      .populate('category', 'name')
      .limit(limitNum)
      .skip(skip)
      .sort({ name: 1 });

    // Get total count
    const total = await MenuItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: menuItems
    });
  } catch (error: any) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      'category',
      'name description'
    );

    if (!menuItem) {
      res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error: any) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
      error: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/menu/categories
// @access  Public
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// @desc    Search menu items
// @route   GET /api/menu/search
// @access  Public
export const searchMenuItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
      return;
    }

    const menuItems = await MenuItem.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ],
      isAvailable: true
    })
      .populate('category', 'name')
      .limit(10);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error: any) {
    console.error('Search menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};
