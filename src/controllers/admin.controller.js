import MenuItem from "../models/menuItem.model.js";
import Category from "../models/category.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.config.js";

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, preparationTime, isAvailable } =
      req.body;

    // Validation
    if (!name || !description || !category || !price || !preparationTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Handle image upload
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "menu-items",
        );
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      name,
      description,
      category,
      price: parseFloat(price),
      preparationTime: parseInt(preparationTime),
      imageUrl,
      imagePublicId,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    await menuItem.populate("category", "name");

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create menu item",
      error: error.message,
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, preparationTime, isAvailable } =
      req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Check if category exists (if provided)
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      menuItem.category = category;
    }

    // Update fields
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price !== undefined) menuItem.price = parseFloat(price);
    if (preparationTime !== undefined)
      menuItem.preparationTime = parseInt(preparationTime);
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    // Handle image upload (if new image provided)
    if (req.file) {
      try {
        // Delete old image if exists
        if (menuItem.imagePublicId) {
          await deleteFromCloudinary(menuItem.imagePublicId);
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "menu-items",
        );
        menuItem.imageUrl = uploadResult.url;
        menuItem.imagePublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    await menuItem.save();
    await menuItem.populate("category", "name");

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update menu item",
      error: error.message,
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (menuItem.imagePublicId) {
      try {
        await deleteFromCloudinary(menuItem.imagePublicId);
      } catch (error) {
        console.error("Image deletion error:", error);
      }
    }

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
      error: error.message,
    });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: `Menu item ${menuItem.isAvailable ? "enabled" : "disabled"}`,
      data: menuItem,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle availability",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide category name",
      });
    }

    // Check if category already exists
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if any menu items use this category
    const menuItemsCount = await MenuItem.countDocuments({
      category: req.params.id,
    });
    if (menuItemsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${menuItemsCount} menu items are using this category.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
