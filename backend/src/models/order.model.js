import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderItemSchema = new Schema(
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
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Quantity cannot exceed 10']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user']
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: [0, 'Total amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    specialInstructions: {
      type: String,
      maxlength: [200, 'Special instructions cannot exceed 200 characters']
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    estimatedReadyTime: {
      type: Date
    },
    actualReadyTime: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ user: 1, orderDate: -1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ orderDate: -1 });

orderSchema.pre('save', function (next) {
  if (this.isNew && !this.estimatedReadyTime) {
    const totalPrepTime = this.items.reduce((total) => {
      return Math.max(total, 15);
    }, 0);

    this.estimatedReadyTime = new Date(Date.now() + totalPrepTime * 60 * 1000);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;