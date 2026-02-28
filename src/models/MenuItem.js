import mongoose from "mongoose";

const { Schema } = mongoose;

const menuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide item name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Please provide item description"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide item category"],
      ref: "Category",
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide item price"],
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    preparationTime: {
      type: Number,
      required: [true, "Please provide preparation time"],
      min: [1, "Preparation time must be at least 1 minute"],
    },
  },
  {
    timestamps: true,
  },
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
