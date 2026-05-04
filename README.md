# NUB Campus Food Delivery System

This package contains the completed project deliverables:

- `backend/` - existing backend code kept unchanged
- `frontend/` - completed React frontend integrated with the backend API

## Run backend

```bash
cd backend
npm install
npm run dev
```

## Run frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Frontend environment

Set the API base URL in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Production build

```bash
cd frontend
npm run build
```

The frontend includes:

- student authentication flows
- menu browsing, search, filtering, item details
- cart and checkout
- order history and order tracking
- profile management and password change
- admin dashboard
- admin order processing
- admin menu and category management
- admin user role management
- admin reports with CSV export
