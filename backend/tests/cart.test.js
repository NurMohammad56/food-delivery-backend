import request from "supertest";
import app from "../src/app.js";
import { createCategory, createMenuItem, createUser, tokenForUser } from "./helpers/factories.js";

describe("Cart API", () => {
  it("GET /api/v1/cart requires authentication", async () => {
    const res = await request(app).get("/api/v1/cart");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/cart initializes empty cart for new user", async () => {
    const user = await createUser({ studentId: "SID4001" });
    const token = tokenForUser(user);

    const res = await request(app)
      .get("/api/v1/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(0);
    expect(res.body.data.totalAmount).toBe(0);
  });

  it("POST /api/v1/cart/items adds item to cart", async () => {
    const user = await createUser({ studentId: "SID4002" });
    const token = tokenForUser(user);
    const category = await createCategory();
    const menuItem = await createMenuItem({ category, price: 120 });

    const res = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ menuItemId: menuItem._id.toString(), quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.totalAmount).toBe(240);
  });

  it("POST /api/v1/cart/items rejects invalid quantity", async () => {
    const user = await createUser({ studentId: "SID4003" });
    const token = tokenForUser(user);
    const menuItem = await createMenuItem();

    const res = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ menuItemId: menuItem._id.toString(), quantity: 11 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/between 1 and 10/i);
  });

  it("PUT /api/v1/cart/items/:menuItemId updates quantity", async () => {
    const user = await createUser({ studentId: "SID4004" });
    const token = tokenForUser(user);
    const category = await createCategory();
    const menuItem = await createMenuItem({ category, price: 100 });

    await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ menuItemId: menuItem._id.toString(), quantity: 1 });

    const res = await request(app)
      .put(`/api/v1/cart/items/${menuItem._id.toString()}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items[0].quantity).toBe(3);
    expect(res.body.data.totalAmount).toBe(300);
  });

  it("DELETE /api/v1/cart/items/:menuItemId removes item", async () => {
    const user = await createUser({ studentId: "SID4005" });
    const token = tokenForUser(user);
    const category = await createCategory();
    const menuItem = await createMenuItem({ category });

    await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ menuItemId: menuItem._id.toString(), quantity: 1 });

    const res = await request(app)
      .delete(`/api/v1/cart/items/${menuItem._id.toString()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(0);
  });

  it("DELETE /api/v1/cart clears cart", async () => {
    const user = await createUser({ studentId: "SID4006" });
    const token = tokenForUser(user);
    const category = await createCategory();
    const menuItem = await createMenuItem({ category });

    await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ menuItemId: menuItem._id.toString(), quantity: 1 });

    const res = await request(app)
      .delete("/api/v1/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(0);
    expect(res.body.data.totalAmount).toBe(0);
  });
});
