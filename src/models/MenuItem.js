import mongoose from 'mongoose';

const { Schema } = mongoose;

const menuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Please provide item category'],
      ref: 'Category'
    },
    price: {
      type: Number,
      required: [true, 'Please provide item price'],
      min: [0, 'Price cannot be negative']
    },
    imageUrl: {
      type: String,
      default: null
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    preparationTime: {
      type: Number,
      required: [true, 'Please provide preparation time'],
      min: [1, 'Preparation time must be at least 1 minute']
    }
  },
  {
    timestamps: true
  }
);

menuItemSchema.index({ name: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ price: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;