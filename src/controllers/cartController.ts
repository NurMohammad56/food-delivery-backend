import { Request, Response } from 'express';
import Cart from '../models/Cart';
import MenuItem from '../models/MenuItem';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate(
      'items.menuItem',
      'name price imageUrl isAvailable'
    );

    // Create empty cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
        totalAmount: 0
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

    // Validation
    if (!menuItemId) {
      res.status(400).json({
        success: false,
        message: 'Please provide menu item ID'
      });
      return;
    }

    if (quantity < 1 || quantity > 10) {
      res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 10'
      });
      return;
    }

    // Check if menu item exists and is available
    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
      res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
      return;
    }

    if (!menuItem.isAvailable) {
      res.status(400).json({
        success: false,
        message: 'This item is currently unavailable'
      });
      return;
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({
        user: req.userId,
        items: [],
        totalAmount: 0
      });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > 10) {
        res.status(400).json({
          success: false,
          message: 'Maximum quantity per item is 10'
        });
        return;
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].subtotal = newQuantity * menuItem.price;
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        subtotal: quantity * menuItem.price
      });
    }

    // Save cart (pre-save hook will calculate total)
    await cart.save();

    // Populate and return
    await cart.populate('items.menuItem', 'name price imageUrl isAvailable');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:menuItemId
// @access  Private
export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (quantity === undefined || quantity < 0 || quantity > 10) {
      res.status(400).json({
        success: false,
        message: 'Quantity must be between 0 and 10'
      });
      return;
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
      return;
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
      return;
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal =
        quantity * cart.items[itemIndex].price;
    }

    // Save and populate
    await cart.save();
    await cart.populate('items.menuItem', 'name price imageUrl isAvailable');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error: any) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:menuItemId
// @access  Private
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { menuItemId } = req.params;

    // Get cart
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
      return;
    }

    // Remove item
    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItemId
    );

    // Save and populate
    await cart.save();
    await cart.populate('items.menuItem', 'name price imageUrl isAvailable');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
      return;
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error: any) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
