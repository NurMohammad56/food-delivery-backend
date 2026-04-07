# Postman Documentation - NUB Food Delivery Backend

## Included Files

- `NUB_Food_Delivery_API.postman_collection.json` - Complete API collection for all routes.
- `NUB_Food_Delivery_API.postman_environment.json` - Local environment variables for the collection.

## Base URL

Use this base URL in Postman:

```text
http://localhost:5000/api/v1
```

## Import Steps

1. Open Postman.
2. Import `NUB_Food_Delivery_API.postman_collection.json`.
3. Import `NUB_Food_Delivery_API.postman_environment.json`.
4. Select the environment: `NUB Food Delivery API - Local`.

## Variables

- `baseUrl`: API base path.
- `authToken`: JWT for authenticated student/user routes.
- `adminToken`: JWT for admin-only routes.
- `resetToken`: Password reset token used in `/auth/reset-password/:resetToken`.
- `menuItemId`: Used by cart/admin menu endpoints.
- `categoryId`: Used by menu filtering and admin category/menu endpoints.
- `orderId`: Used by order endpoints.
- `userId`: Used by admin role update endpoint.

The collection auto-sets some variables from responses (token and IDs).

## Suggested Run Order

1. `Health -> Health Check`
2. `Authentication -> Register` or `Authentication -> Login`
3. `Menu (Public) -> Get Categories` (sets `categoryId`)
4. `Menu (Public) -> Get All Menu Items` (sets `menuItemId`)
5. `Cart` requests
6. `Orders (Student)` requests
7. Login as admin and run admin folders (`Admin - Users`, `Admin - Menu & Categories`, `Admin - Orders`)

## Auth Notes

- Protected routes require `Authorization: Bearer <token>`.
- In this collection, protected requests use `{{authToken}}` or `{{adminToken}}`.
- `Login` request script stores `authToken` automatically.
- If logged-in user role is `admin`, `adminToken` is auto-set.

## Endpoint Coverage (Complete)

### Health

- `GET /health`

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:resetToken`
- `GET /auth/me`

### Users (Protected)

- `PUT /users/profile`
- `POST /users/avatar` (form-data file field: `avatar`)
- `DELETE /users/avatar`
- `PUT /users/change-password`

### Menu (Public)

- `GET /menu` (supports `category`, `minPrice`, `maxPrice`, `isAvailable`, `search`, `page`, `limit`)
- `GET /menu/search?q=...`
- `GET /menu/categories`
- `GET /menu/:id`

### Cart (Protected)

- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items/:menuItemId`
- `DELETE /cart/items/:menuItemId`
- `DELETE /cart`

### Orders (Protected: Student/User)

- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `PUT /orders/:id/cancel`

### Admin - Users

- `GET /users/admin/all`
- `PUT /users/admin/:id/role`

### Admin - Menu & Categories

- `POST /admin/menu` (form-data; optional `image` file)
- `PUT /admin/menu/:id` (form-data; optional `image` file)
- `DELETE /admin/menu/:id`
- `PATCH /admin/menu/:id/availability`
- `POST /admin/categories`
- `PUT /admin/categories/:id`
- `DELETE /admin/categories/:id`

### Admin - Orders

- `GET /orders/admin/all`
- `PUT /orders/:id/status`
- `GET /orders/admin/stats`

## Seed Credentials (if you used `npm run seed`)

- Admin:
  - Email: `admin@nub.edu`
  - Password: `Admin123!`
- Student:
  - Email: `nur@student.nub.edu`
  - Password: `Student123!`

## Common Error Cases

- `401`: Missing or invalid token.
- `403`: Logged-in user is not admin for admin-only endpoints.
- `404`: Invalid resource ID or route.
- `400`: Validation issue (missing fields, invalid quantity/status, etc.).
