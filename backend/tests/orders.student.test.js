import request from "supertest";
import app from "../src/app.js";
import {
  createCategory,
  createMenuItem,
  createUser,
  tokenForUser,
  createCartForUser,
  createOrder,
} from "./helpers/factories.js";

describe("Orders API (Student)", () => {
  it("POST /api/v1/orders rejects when cart is empty", async () => {
    const user = await createUser({ studentId: "SID5001" });
    const token = tokenForUser(user);

    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ specialInstructions: "No onions" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/cart is empty/i);
  });

  it("POST /api/v1/orders places order and clears cart", async () => {
    const user = await createUser({ studentId: "SID5002" });
    const token = tokenForUser(user);
    const category = await createCategory();
    const menuItem = await createMenuItem({ category, price: 150, preparationTime: 20 });

    await createCartForUser(user, menuItem, 2);

    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ specialInstructions: "Extra sauce" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAmount).toBe(300);
    expect(res.body.data.status).toBe("Pending");

    const cartRes = await request(app)
      .get("/api/v1/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(cartRes.status).toBe(200);
    expect(cartRes.body.data.items).toHaveLength(0);
  });

  it("GET /api/v1/orders returns user's orders", async () => {
    const user = await createUser({ studentId: "SID5003" });
    const token = tokenForUser(user);
    const menuItem = await createMenuItem();

    await createOrder({ user: user._id, menuItem, status: "Pending" });

    const res = await request(app)
      .get("/api/v1/orders?status=Pending&page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].status).toBe("Pending");
  });

  it("GET /api/v1/orders/:id returns order for owner", async () => {
    const user = await createUser({ studentId: "SID5004" });
    const token = tokenForUser(user);
    const menuItem = await createMenuItem();
    const order = await createOrder({ user: user._id, menuItem });

    const res = await request(app)
      .get(`/api/v1/orders/${order._id.toString()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(order._id.toString());
  });

  it("GET /api/v1/orders/:id returns 404 for non-owner", async () => {
    const owner = await createUser({ studentId: "SID5005" });
    const otherUser = await createUser({ studentId: "SID5006" });
    const token = tokenForUser(otherUser);
    const menuItem = await createMenuItem();
    const order = await createOrder({ user: owner._id, menuItem });

    const res = await request(app)
      .get(`/api/v1/orders/${order._id.toString()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("PUT /api/v1/orders/:id/cancel cancels pending order", async () => {
    const user = await createUser({ studentId: "SID5007" });
    const token = tokenForUser(user);
    const menuItem = await createMenuItem();
    const order = await createOrder({ user: user._id, menuItem, status: "Pending" });

    const res = await request(app)
      .put(`/api/v1/orders/${order._id.toString()}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("Cancelled");
  });

  it("PUT /api/v1/orders/:id/cancel rejects non-pending order", async () => {
    const user = await createUser({ studentId: "SID5008" });
    const token = tokenForUser(user);
    const menuItem = await createMenuItem();
    const order = await createOrder({ user: user._id, menuItem, status: "Preparing" });

    const res = await request(app)
      .put(`/api/v1/orders/${order._id.toString()}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/pending/i);
  });
});
