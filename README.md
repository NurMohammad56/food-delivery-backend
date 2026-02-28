# NUB Campus Food Delivery System - Backend API

Backend REST API for the NUB Campus Food Delivery System built with Node.js, Express, JavaScript, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)

## ✨ Features

- ✅ User authentication (Register, Login, Password Reset)
- ✅ JWT-based authorization
- ✅ Menu browsing with search and filters
- ✅ Shopping cart management
- ✅ MongoDB integration with Mongoose ODM
- ✅ JavaScript for type safety
- ✅ Password hashing with bcrypt
- ✅ Email notifications with NodeMailer
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** JavaScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Email:** NodeMailer
- **Validation:** express-validator

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd food-delivery-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration (see [Configuration](#configuration))

## ⚙️ Configuration

Edit the `.env` file with your settings:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nub_food_delivery

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=24h

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=NUB Food Delivery <noreply@nubfood.com>

# Client URL
CLIENT_URL=http://localhost:3000
```

### MongoDB Setup Options

**Option 1: Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/nub_food_delivery
```

**Option 2: MongoDB Atlas (Recommended)**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nub_food_delivery
```

### Gmail SMTP Setup

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password: Google Account > Security > App Passwords
3. Use the generated password in `EMAIL_PASSWORD`

## 🏃 Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Testing the API
```bash
# Health check
curl http://localhost:5000/health
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "studentId": "42230301051",
  "phone": "01712345678",
  "password": "securepass123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "studentId": "42230301051",
      "phone": "01712345678",
      "role": "student"
    }
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

#### 3. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

#### 4. Reset Password
```http
POST /api/auth/reset-password/:resetToken
Content-Type: application/json

{
  "password": "newSecurePass123"
}
```

#### 5. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Menu Endpoints

#### 1. Get All Menu Items
```http
GET /api/menu
Query Parameters:
  - category (optional): Filter by category
  - minPrice (optional): Minimum price
  - maxPrice (optional): Maximum price
  - isAvailable (optional): true/false
  - search (optional): Search term
  - page (optional): Page number (default: 1)
  - limit (optional): Items per page (default: 20)
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "65abc...",
      "name": "Chicken Burger",
      "description": "Delicious grilled chicken burger",
      "category": "65def...",
      "price": 250,
      "isAvailable": true,
      "preparationTime": 15
    }
  ]
}
```

#### 2. Get Single Menu Item
```http
GET /api/menu/:id
```

#### 3. Search Menu Items
```http
GET /api/menu/search?q=burger
```

#### 4. Get Categories
```http
GET /api/menu/categories
```

### Cart Endpoints (Protected - Requires Authentication)

#### 1. Get User's Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc...",
    "user": "65def...",
    "items": [
      {
        "menuItem": "65ghi...",
        "name": "Chicken Burger",
        "price": 250,
        "quantity": 2,
        "subtotal": 500
      }
    ],
    "totalAmount": 500
  }
}
```

#### 2. Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuItemId": "65abc123...",
  "quantity": 2
}
```

#### 3. Update Cart Item Quantity
```http
PUT /api/cart/items/:menuItemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### 4. Remove Item from Cart
```http
DELETE /api/cart/items/:menuItemId
Authorization: Bearer <token>
```

#### 5. Clear Cart
```http
DELETE /api/cart
Authorization: Bearer <token>
```

### Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📁 Project Structure

```
food-delivery-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── menuController.js    # Menu operations
│   │   └── cartController.js    # Cart operations
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── MenuItem.js         # Menu item schema
│   │   ├── Category.js         # Category schema
│   │   ├── Order.js            # Order schema
│   │   └── Cart.js             # Cart schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── menuRoutes.js       # Menu endpoints
│   │   └── cartRoutes.js       # Cart endpoints
│   ├── utils/
│   │   ├── jwt.js              # JWT utilities
│   │   ├── resetToken.js       # Password reset tokens
│   │   └── email.js            # Email utilities
│   └── server.js               # Application entry point
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🗄 Database Schema

### User Collection
```JavaScript
{
  name: String (required),
  email: String (required, unique),
  studentId: String (required, unique),
  phone: String (required),
  password: String (required, hashed),
  role: String (enum: ['student', 'admin']),
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Collection
```JavaScript
{
  name: String (required),
  description: String (required),
  category: ObjectId (ref: Category),
  price: Number (required),
  imageUrl: String,
  isAvailable: Boolean,
  preparationTime: Number (minutes),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Collection
```JavaScript
{
  name: String (required, unique),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Collection
```JavaScript
{
  user: ObjectId (ref: User, unique),
  items: [
    {
      menuItem: ObjectId (ref: MenuItem),
      name: String,
      price: Number,
      quantity: Number (1-10),
      subtotal: Number
    }
  ],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```JavaScript
{
  user: ObjectId (ref: User),
  items: [
    {
      menuItem: ObjectId (ref: MenuItem),
      name: String,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  status: String (enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled']),
  specialInstructions: String,
  orderDate: Date,
  estimatedReadyTime: Date,
  actualReadyTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 👤 Author

**Nur Mohammad**  
Student ID: 42230301051  
Course: CSE 3292 - Software Development III  
Northern University Bangladesh

## 📄 License

This project is for academic purposes.

