import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  menuItem: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  specialInstructions?: string;
  orderDate: Date;
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
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

const orderSchema = new Schema<IOrder>(
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
        validator: function (items: IOrderItem[]) {
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

// Indexes for performance
orderSchema.index({ user: 1, orderDate: -1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ orderDate: -1 });

// Calculate estimated ready time before saving
orderSchema.pre('save', function (next) {
  if (this.isNew && !this.estimatedReadyTime) {
    // Calculate total preparation time
    const totalPrepTime = this.items.reduce((total, item) => {
      return Math.max(total, 15); // Assume 15 min minimum per item
    }, 0);
    
    this.estimatedReadyTime = new Date(Date.now() + totalPrepTime * 60 * 1000);
  }
  next();
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
