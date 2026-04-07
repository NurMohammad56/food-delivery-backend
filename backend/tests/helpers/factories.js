import User from "../../src/models/user.model.js";
import Category from "../../src/models/category.model.js";
import MenuItem from "../../src/models/menuItem.model.js";
import Cart from "../../src/models/cart.model.js";
import Order from "../../src/models/order.model.js";
import { generateToken } from "../../src/utils/jwt.js";

let sequence = 0;

const nextSequence = () => {
  sequence += 1;
  return sequence;
};

export const createUser = async (overrides = {}) => {
  const id = nextSequence();

  const user = await User.create({
    name: `User ${id}`,
    email: `user${id}@example.com`,
    studentId: `SID${1000 + id}`,
    phone: `01700000${String(id).padStart(3, "0")}`,
    password: "Password123!",
    role: "student",
    ...overrides,
  });

  return user;
};

export const createAdmin = async (overrides = {}) => {
  return createUser({
    role: "admin",
    ...overrides,
  });
};

export const tokenForUser = (user) => {
  return generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });
};

export const createCategory = async (overrides = {}) => {
  const id = nextSequence();

  const category = await Category.create({
    name: `Category ${id}`,
    description: `Category description ${id}`,
    ...overrides,
  });

  return category;
};

export const createMenuItem = async (overrides = {}) => {
  const id = nextSequence();
  const { category: categoryOverride, ...rest } = overrides;

  let categoryId;
  if (categoryOverride) {
    if (categoryOverride._id) {
      categoryId = categoryOverride._id.toString();
    } else {
      categoryId = categoryOverride.toString();
    }
  } else {
    const createdCategory = await createCategory();
    categoryId = createdCategory._id.toString();
  }

  const menuItem = await MenuItem.create({
    name: `Menu Item ${id}`,
    description: `Menu description ${id}`,
    category: categoryId,
    price: 100,
    preparationTime: 10,
    isAvailable: true,
    ...rest,
  });

  return menuItem;
};

export const createCartForUser = async (user, menuItem, quantity = 1) => {
  return Cart.create({
    user: user._id,
    items: [
      {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        subtotal: quantity * menuItem.price,
      },
    ],
  });
};

export const createOrder = async (overrides = {}) => {
  const userInput = overrides.user || (await createUser());
  const menuItemInput = overrides.menuItem || (await createMenuItem());
  const userId = userInput?._id || userInput;
  const menuItem = menuItemInput?._id
    ? menuItemInput
    : await MenuItem.findById(menuItemInput);

  return Order.create({
    user: userId,
    items: [
      {
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: 2,
        price: menuItem.price,
        subtotal: menuItem.price * 2,
      },
    ],
    totalAmount: menuItem.price * 2,
    status: "Pending",
    orderDate: new Date(),
    ...overrides,
  });
};
