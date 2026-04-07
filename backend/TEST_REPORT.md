# Backend Test Report (Integration Tests Presented as Unit Test Cases)

## Project
- Name: NUB Food Delivery Backend
- Date: 2026-03-04
- Framework: Vitest + Supertest + MongoMemoryServer
- Test Type: API Integration Tests (with mocked externals), documented as unit test cases

## Execution Summary
- Command: `npm test`
- Test files: 9
- Total test cases: 54
- Passed: 54
- Failed: 0
- Result: PASS

## Coverage Summary
- Command: `npm run test:coverage`
- Statement coverage: `75.31%`
- Branch coverage: `64.40%`
- Function coverage: `92.30%`
- Line coverage: `75.77%`

## External Dependencies Mocked
- `nodemailer` mocked (no real email sent)
- `cloudinary` mocked (no real upload/delete network calls)

## Issues Encountered and Fixed During Testing
### Issue 1: Testability Architecture Blocking Reliable API Tests
- What we found:
  - `src/server.js` was doing three things together: app creation, DB connection, and `listen()`.
  - This pattern makes automated tests harder because importing the app also starts the real server lifecycle.
- Evidence observed:
  - Early test setup required structural refactor before safe suite execution.
- Root cause:
  - No separation between app composition and runtime bootstrapping.
- Fix applied:
  - Added [app.js](/C:/Users/bdcalling/Desktop/New%20folder/food-delivery-backend/src/app.js) for pure Express setup.
  - Kept [server.js](/C:/Users/bdcalling/Desktop/New%20folder/food-delivery-backend/src/server.js) for DB connect + `listen()`.
- Retest result:
  - Test runner can import app safely and execute all suites in isolation.

### Issue 2: First Full Test Run Had 3 Failing Cases
- Initial failed run snapshot:
  - Total tests: 54
  - Passed: 51
  - Failed: 3
  - Failed suites:
    - `tests/menu.test.js`
    - `tests/admin.menu-categories.test.js`

#### 2.1 Failure: Menu filter by category returned 0 instead of 1
- Failing case:
  - `GET /api/v1/menu supports category and price filters`
- Expected:
  - `count = 1`
- Actual:
  - `count = 0`
- Root cause:
  - Test factory was storing `category` incorrectly when object/string variants were passed.
- Fix:
  - Normalized category assignment in [factories.js](/C:/Users/bdcalling/Desktop/New%20folder/food-delivery-backend/tests/helpers/factories.js) (`createMenuItem`).

#### 2.2 Failure: Admin menu update returned 500 instead of 200
- Failing case:
  - `PUT /api/v1/admin/menu/:id updates menu item`
- Expected:
  - `200`
- Actual:
  - `500`
- Error seen:
  - `MenuItem validation failed: category: Please provide item category`
- Root cause:
  - Same category normalization bug from shared test data factory.
- Fix:
  - Same normalization fix in `createMenuItem` factory.

#### 2.3 Failure: Category-in-use delete protection returned 200 instead of 400
- Failing case:
  - `DELETE /api/v1/admin/categories/:id fails when category is in use`
- Expected:
  - `400`
- Actual:
  - `200`
- Root cause:
  - The menu item was not associated with category as expected because of the same factory bug; therefore usage check found no linked items.
- Fix:
  - Same category normalization fix in `createMenuItem` factory.

### Verification After Fixes
- Re-ran `npm test`:
  - 54 passed, 0 failed.
- Re-ran `npm run test:coverage`:
  - Completed successfully with coverage metrics captured.

## Test Case Results (Expected vs Actual)

### Health API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| H-01 | `GET /api/v1/health` | `200`, `success: true`, API message, timestamp | `200`, matched | PASS |

### Auth API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| A-01 | `POST /api/v1/auth/register` | `201`, token + user data | `201`, matched | PASS |
| A-02 | `POST /api/v1/auth/register` duplicate email | `400`, already registered | `400`, matched | PASS |
| A-03 | `POST /api/v1/auth/login` valid | `200`, token | `200`, matched | PASS |
| A-04 | `POST /api/v1/auth/login` invalid password | `401`, invalid credentials | `401`, matched | PASS |
| A-05 | `POST /api/v1/auth/forgot-password` valid email | `200`, reset email sent message | `200`, matched | PASS |
| A-06 | `POST /api/v1/auth/reset-password/:token` valid | `200`, new token | `200`, matched | PASS |
| A-07 | `POST /api/v1/auth/reset-password/:token` invalid token | `400`, invalid/expired message | `400`, matched | PASS |
| A-08 | `GET /api/v1/auth/me` without token | `401` | `401`, matched | PASS |
| A-09 | `GET /api/v1/auth/me` with token | `200`, user profile | `200`, matched | PASS |

### Users API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| U-01 | `PUT /api/v1/users/profile` | `200`, updated fields | `200`, matched | PASS |
| U-02 | `POST /api/v1/users/avatar` | `200`, avatar URL | `200`, matched | PASS |
| U-03 | `DELETE /api/v1/users/avatar` | `200`, delete success message | `200`, matched | PASS |
| U-04 | `PUT /api/v1/users/change-password` valid | `200` | `200`, matched | PASS |
| U-05 | `PUT /api/v1/users/change-password` wrong current | `401`, incorrect password message | `401`, matched | PASS |

### Menu API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| M-01 | `GET /api/v1/menu` | `200`, paginated list | `200`, matched | PASS |
| M-02 | `GET /api/v1/menu` with category/price filters | `200`, filtered items | `200`, matched | PASS |
| M-03 | `GET /api/v1/menu/categories` | `200`, category list | `200`, matched | PASS |
| M-04 | `GET /api/v1/menu/:id` | `200`, single item | `200`, matched | PASS |
| M-05 | `GET /api/v1/menu/search` without q | `400`, missing query message | `400`, matched | PASS |
| M-06 | `GET /api/v1/menu/search?q=...` | `200`, only available matched items | `200`, matched | PASS |

### Cart API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| C-01 | `GET /api/v1/cart` without token | `401` | `401`, matched | PASS |
| C-02 | `GET /api/v1/cart` first time | `200`, empty cart initialized | `200`, matched | PASS |
| C-03 | `POST /api/v1/cart/items` valid | `200`, item added + total updated | `200`, matched | PASS |
| C-04 | `POST /api/v1/cart/items` invalid quantity | `400`, quantity validation message | `400`, matched | PASS |
| C-05 | `PUT /api/v1/cart/items/:menuItemId` | `200`, quantity updated | `200`, matched | PASS |
| C-06 | `DELETE /api/v1/cart/items/:menuItemId` | `200`, item removed | `200`, matched | PASS |
| C-07 | `DELETE /api/v1/cart` | `200`, cart cleared | `200`, matched | PASS |

### Orders API (Student)
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| O-01 | `POST /api/v1/orders` empty cart | `400`, cart empty | `400`, matched | PASS |
| O-02 | `POST /api/v1/orders` valid cart | `201`, order created + cart cleared | `201`, matched | PASS |
| O-03 | `GET /api/v1/orders` | `200`, paginated user orders | `200`, matched | PASS |
| O-04 | `GET /api/v1/orders/:id` owner | `200`, order detail | `200`, matched | PASS |
| O-05 | `GET /api/v1/orders/:id` non-owner | `404` | `404`, matched | PASS |
| O-06 | `PUT /api/v1/orders/:id/cancel` pending | `200`, status Cancelled | `200`, matched | PASS |
| O-07 | `PUT /api/v1/orders/:id/cancel` non-pending | `400`, pending-only validation | `400`, matched | PASS |

### Admin Users API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| AU-01 | `GET /api/v1/users/admin/all` as student | `403` | `403`, matched | PASS |
| AU-02 | `GET /api/v1/users/admin/all` as admin | `200`, user list | `200`, matched | PASS |
| AU-03 | `PUT /api/v1/users/admin/:id/role` invalid role | `400`, invalid role message | `400`, matched | PASS |
| AU-04 | `PUT /api/v1/users/admin/:id/role` valid role | `200`, role updated | `200`, matched | PASS |

### Admin Menu & Categories API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| AMC-01 | `POST /api/v1/admin/categories` | `201`, category created | `201`, matched | PASS |
| AMC-02 | `POST /api/v1/admin/categories` duplicate | `400` | `400`, matched | PASS |
| AMC-03 | `PUT /api/v1/admin/categories/:id` valid | `200`, category updated | `200`, matched | PASS |
| AMC-04 | `POST /api/v1/admin/menu` missing fields | `400`, validation message | `400`, matched | PASS |
| AMC-05 | `POST /api/v1/admin/menu` with image | `201`, item created + image URL | `201`, matched | PASS |
| AMC-06 | `PUT /api/v1/admin/menu/:id` | `200`, item updated | `200`, matched | PASS |
| AMC-07 | `PATCH /api/v1/admin/menu/:id/availability` | `200`, availability toggled | `200`, matched | PASS |
| AMC-08 | `DELETE /api/v1/admin/categories/:id` category in use | `400`, cannot delete message | `400`, matched | PASS |
| AMC-09 | `DELETE /api/v1/admin/menu/:id` then delete category | `200` then `200` | matched | PASS |
| AMC-10 | `PUT /api/v1/admin/categories/:id` unknown | `404` | `404`, matched | PASS |

### Admin Orders API
| ID | Endpoint | Expected | Actual | Result |
|---|---|---|---|---|
| AO-01 | `GET /api/v1/orders/admin/all` as student | `403` | `403`, matched | PASS |
| AO-02 | `GET /api/v1/orders/admin/all` as admin | `200`, order list + stats | `200`, matched | PASS |
| AO-03 | `PUT /api/v1/orders/:id/status` invalid status | `400`, invalid status | `400`, matched | PASS |
| AO-04 | `PUT /api/v1/orders/:id/status` -> Ready | `200`, status updated + `actualReadyTime` set | `200`, matched | PASS |
| AO-05 | `GET /api/v1/orders/admin/stats` | `200`, analytics payload | `200`, matched | PASS |

## Conclusion
- The backend is now running with a full automated testing system.
- All implemented test cases passed successfully.
- The suite is stable, isolated (in-memory DB), and safe for repeated evaluation.

## How to Re-run
```bash
npm test
```

## Notes
- Technically they are API integration tests, which is the correct practical approach for this backend architecture.
