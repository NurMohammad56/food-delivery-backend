import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';

export const getMenuItems = async (req, res) => {
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

    const query = {};

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

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const menuItems = await MenuItem.find(query)
      .populate('category', 'name')
      .limit(limitNum)
      .skip(skip)
      .sort({ name: 1 });

    const total = await MenuItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error?.message
    });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('category', 'name description');

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
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
      error: error?.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error?.message
    });
  }
};

export const searchMenuItems = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
      return;
    }

    const queryText = String(q);

    const menuItems = await MenuItem.find({
      $or: [
        { name: { $regex: queryText, $options: 'i' } },
        { description: { $regex: queryText, $options: 'i' } }
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
  } catch (error) {
    console.error('Search menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error?.message
    });
  }
};