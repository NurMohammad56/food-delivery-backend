import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ name: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;