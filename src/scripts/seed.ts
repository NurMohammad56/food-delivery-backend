import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Category from '../models/Category';
import MenuItem from '../models/MenuItem';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/nub_food_delivery'
    );
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@nub.edu',
      studentId: 'ADMIN001',
      phone: '01700000000',
      password: 'Admin123!',
      role: 'admin',
      isVerified: true
    });
    console.log('✓ Created admin user');

    // Create test student user
    const studentUser = await User.create({
      name: 'Nur Mohammad',
      email: 'nur@student.nub.edu',
      studentId: '42230301051',
      phone: '01712345678',
      password: 'Student123!',
      role: 'student',
      isVerified: true
    });
    console.log('✓ Created student user');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Breakfast',
        description: 'Morning breakfast items'
      },
      {
        name: 'Lunch',
        description: 'Main course meals'
      },
      {
        name: 'Snacks',
        description: 'Light snacks and appetizers'
      },
      {
        name: 'Beverages',
        description: 'Drinks and beverages'
      },
      {
        name: 'Desserts',
        description: 'Sweet treats and desserts'
      }
    ]);
    console.log(`✓ Created ${categories.length} categories`);

    // Create menu items
    const menuItems = await MenuItem.insertMany([
      // Breakfast
      {
        name: 'Paratha with Egg',
        description: 'Traditional paratha with fried egg',
        category: categories[0]._id,
        price: 80,
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'Singara (2 pcs)',
        description: 'Crispy vegetable samosas',
        category: categories[0]._id,
        price: 30,
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Bread Omelet',
        description: 'Bread with fluffy omelet',
        category: categories[0]._id,
        price: 60,
        isAvailable: true,
        preparationTime: 8
      },

      // Lunch
      {
        name: 'Chicken Fried Rice',
        description: 'Flavorful fried rice with chicken pieces',
        category: categories[1]._id,
        price: 150,
        isAvailable: true,
        preparationTime: 15
      },
      {
        name: 'Beef Kacchi Biryani',
        description: 'Authentic kacchi biryani with tender beef',
        category: categories[1]._id,
        price: 200,
        isAvailable: true,
        preparationTime: 20
      },
      {
        name: 'Fish Curry with Rice',
        description: 'Bengali style fish curry served with steamed rice',
        category: categories[1]._id,
        price: 180,
        isAvailable: true,
        preparationTime: 18
      },
      {
        name: 'Chicken Burger',
        description: 'Grilled chicken burger with fries',
        category: categories[1]._id,
        price: 120,
        isAvailable: true,
        preparationTime: 12
      },

      // Snacks
      {
        name: 'French Fries',
        description: 'Crispy golden french fries',
        category: categories[2]._id,
        price: 50,
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'Chicken Wings (4 pcs)',
        description: 'Spicy chicken wings',
        category: categories[2]._id,
        price: 150,
        isAvailable: true,
        preparationTime: 15
      },
      {
        name: 'Spring Roll (2 pcs)',
        description: 'Vegetable spring rolls',
        category: categories[2]._id,
        price: 70,
        isAvailable: true,
        preparationTime: 10
      },

      // Beverages
      {
        name: 'Mango Juice',
        description: 'Fresh mango juice',
        category: categories[3]._id,
        price: 60,
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Coca Cola',
        description: 'Chilled Coca Cola',
        category: categories[3]._id,
        price: 25,
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Mineral Water',
        description: '500ml bottle',
        category: categories[3]._id,
        price: 20,
        isAvailable: true,
        preparationTime: 1
      },
      {
        name: 'Lassi',
        description: 'Sweet yogurt drink',
        category: categories[3]._id,
        price: 50,
        isAvailable: true,
        preparationTime: 5
      },

      // Desserts
      {
        name: 'Chocolate Cake Slice',
        description: 'Rich chocolate cake',
        category: categories[4]._id,
        price: 80,
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Ice Cream Cup',
        description: 'Vanilla ice cream',
        category: categories[4]._id,
        price: 60,
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Rasgulla (2 pcs)',
        description: 'Traditional Bengali sweet',
        category: categories[4]._id,
        price: 50,
        isAvailable: true,
        preparationTime: 2
      }
    ]);
    console.log(`✓ Created ${menuItems.length} menu items`);

    console.log('\n' + '='.repeat(50));
    console.log('✓ Database seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('\nTest Users Created:');
    console.log(`\nAdmin:`);
    console.log(`  Email: admin@nub.edu`);
    console.log(`  Password: Admin123!`);
    console.log(`\nStudent:`);
    console.log(`  Email: nur@student.nub.edu`);
    console.log(`  Password: Student123!`);
    console.log(`  Student ID: 42230301051`);
    console.log('\n' + '='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
