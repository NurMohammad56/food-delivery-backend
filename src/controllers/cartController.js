import Cart from '../models/Cart.js';
import MenuItem from '../models/MenuItem.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate(
      'items.menuItem',
      'name price imageUrl isAvailable'
    );

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
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error?.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

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

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({
        user: req.userId,
        items: [],
        totalAmount: 0
      });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.menuItem.toString() === menuItemId);

    if (existingItemIndex > -1) {
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
      cart.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        subtotal: quantity * menuItem.price
      });
    }

    await cart.save();
    await cart.populate('items.menuItem', 'name price imageUrl isAvailable');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error?.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0 || quantity > 10) {
      res.status(400).json({
        success: false,
        message: 'Quantity must be between 0 and 10'
      });
      return;
    }

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
      return;
    }

    const itemIndex = cart.items.findIndex((item) => item.menuItem.toString() === menuItemId);

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
      return;
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = quantity * cart.items[itemIndex].price;
    }

    await cart.save();
    await cart.populate('items.menuItem', 'name price imageUrl isAvailable');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error?.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
      return;
    }

    cart.items = cart.items.filter((item) => item.menuItem.toString() !== menuItemId);

    await cart.save();
    await cart.populate('items.menuItem', 'name price imageUrl isAvailable');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error?.message
    });
  }
};

export const clearCart = async (req, res) => {
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
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error?.message
    });
  }
};