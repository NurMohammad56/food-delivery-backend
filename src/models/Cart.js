import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Quantity cannot exceed 10']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    }
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a user'],
      unique: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

cartSchema.index({ user: 1 });

cartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;