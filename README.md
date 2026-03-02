# NUB Campus Food Delivery System - Backend API

Backend REST API for the NUB Campus Food Delivery System built with Node.js, Express, JavaScript, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)

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

## 🏃 Running the Application

### Development Mode (with hot reload)

```bash
npm run dev
```

### Base URL

```
http://localhost:5000/api
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

## 👤 Author

**Nur Mohammad**  
Student ID: 42230301051  
Course: CSE 3292 - Software Development III  
Northern University Bangladesh

## 📄 License

This project is for academic purposes.
