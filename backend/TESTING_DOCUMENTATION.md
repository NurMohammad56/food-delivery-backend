# Testing Documentation

## Purpose

This project uses API integration tests (presented as unit test cases in academic reporting) to validate complete backend behavior:

- Routing
- Middleware (auth/authorization)
- Controller logic
- Model interaction with MongoDB
- Response status and payload contracts

## Testing Stack

- `vitest`: test runner and assertions
- `supertest`: HTTP request simulation against Express app
- `mongodb-memory-server`: isolated in-memory MongoDB for repeatable tests
- `@vitest/coverage-v8`: coverage collection
- `vi.mock` (Vitest): mocking external services

## Why This Approach

For an Express + MongoDB backend, endpoint-level integration tests provide stronger confidence than isolated function-only tests because they validate:

- request -> middleware -> controller -> model -> response
  in one controlled flow.

## Testability Architecture

To make tests stable and fast, app startup was split:

- [app.js](/food-delivery-backend/src/app.js): builds and exports Express app only
- [server.js](/food-delivery-backend/src/server.js): connects DB + starts HTTP listener

Tests import `app` directly, so they do not open a network port.

## Isolation Strategy

Defined in [vitest.setup.js](/food-delivery-backend/tests/setup/vitest.setup.js):

- Boot one in-memory MongoDB before all tests
- Connect Mongoose to in-memory DB
- Clear all collections before each test
- Drop DB and stop server after all tests

Result: no dependency on your local/Atlas database and no test data leakage between test cases.

## Mocked Externals

In `vitest.setup.js`:

- `nodemailer` is mocked:
  - prevents real SMTP traffic
  - returns successful `sendMail` response
- `cloudinary` is mocked:
  - prevents real upload/delete calls
  - returns fake `secure_url` and `public_id`

This keeps tests deterministic and safe.

## Test Data Management

Shared factories in [factories.js](/food-delivery-backend/tests/helpers/factories.js):

- `createUser`, `createAdmin`
- `createCategory`, `createMenuItem`
- `createCartForUser`, `createOrder`
- `tokenForUser`

Benefits:

- Less duplicate setup code
- Consistent entities for all suites
- Easier maintenance when model contracts change

## Test Coverage Scope

Suite files:

- [health.test.js](/food-delivery-backend/tests/health.test.js)
- [auth.test.js](/food-delivery-backend/tests/auth.test.js)
- [users.test.js](/food-delivery-backend/tests/users.test.js)
- [menu.test.js](/food-delivery-backend/tests/menu.test.js)
- [cart.test.js](/food-delivery-backend/tests/cart.test.js)
- [orders.student.test.js](/food-delivery-backend/tests/orders.student.test.js)
- [admin.users.test.js](/food-delivery-backend/tests/admin.users.test.js)
- [admin.menu-categories.test.js](/food-delivery-backend/tests/admin.menu-categories.test.js)
- [admin.orders.test.js](/food-delivery-backend/tests/admin.orders.test.js)

Total implemented cases: `54`

## How To Run

Install deps:

```bash
npm install
```

Run all tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Run with coverage:

```bash
npm run test:coverage
```

## Latest Verified Results (2026-03-04)

- `npm test`: 54/54 passed
- `npm run test:coverage`:
  - Statements: 75.31%
  - Branches: 64.40%
  - Functions: 92.30%
  - Lines: 75.77%

## How A Single Test Works (Flow)

1. Arrange:

- Create DB entities via factory
- Generate auth token if needed

2. Act:

- Send HTTP call using `supertest(request(app))`

3. Assert:

- Check HTTP status code
- Check response payload fields/messages
- Optionally verify persisted DB changes

## How To Add New Test Cases

1. Choose relevant suite file under `tests/`.
2. Create setup data with factory helpers.
3. Call endpoint with Supertest.
4. Assert status + body + side effects.
5. Keep each case independent (no shared mutable state).

## Notes

- Technically, they are integration tests, which is the correct practical design for this backend.
