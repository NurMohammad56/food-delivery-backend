import request from "supertest";
import app from "../src/app.js";
import { createAdmin, createMenuItem, createOrder, createUser, tokenForUser } from "./helpers/factories.js";

describe("Admin Orders API", () => {
  it("GET /api/v1/orders/admin/all forbids student role", async () => {
    const student = await createUser({ studentId: "SID8001" });
    const token = tokenForUser(student);

    const res = await request(app)
      .get("/api/v1/orders/admin/all")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/orders/admin/all returns orders for admin", async () => {
    const admin = await createAdmin({ studentId: "ADM8001" });
    const adminToken = tokenForUser(admin);
    const user = await createUser({ studentId: "SID8002" });
    const menuItem = await createMenuItem();

    await createOrder({ user: user._id, menuItem, status: "Pending" });

    const res = await request(app)
      .get("/api/v1/orders/admin/all?page=1&limit=20")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.total).toBe(1);
    expect(Array.isArray(res.body.stats)).toBe(true);
  });

  it("PUT /api/v1/orders/:id/status rejects invalid status", async () => {
    const admin = await createAdmin({ studentId: "ADM8002" });
    const adminToken = tokenForUser(admin);
    const user = await createUser({ studentId: "SID8003" });
    const menuItem = await createMenuItem();
    const order = await createOrder({ user: user._id, menuItem });

    const res = await request(app)
      .put(`/api/v1/orders/${order._id.toString()}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Cooking" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid status");
  });

  it("PUT /api/v1/orders/:id/status updates to Ready and sets actualReadyTime", async () => {
    const admin = await createAdmin({ studentId: "ADM8003" });
    const adminToken = tokenForUser(admin);
    const user = await createUser({ studentId: "SID8004" });
    const menuItem = await createMenuItem();
    const order = await createOrder({ user: user._id, menuItem, status: "Preparing" });

    const res = await request(app)
      .put(`/api/v1/orders/${order._id.toString()}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Ready" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("Ready");
    expect(res.body.data.actualReadyTime).toBeTruthy();
  });

  it("GET /api/v1/orders/admin/stats returns analytics payload", async () => {
    const admin = await createAdmin({ studentId: "ADM8004" });
    const adminToken = tokenForUser(admin);
    const user = await createUser({ studentId: "SID8005" });
    const menuItem = await createMenuItem({ name: "Stats Item" });

    await createOrder({ user: user._id, menuItem, status: "Completed" });

    const res = await request(app)
      .get("/api/v1/orders/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overall.totalOrders).toBe(1);
    expect(Array.isArray(res.body.data.byStatus)).toBe(true);
    expect(Array.isArray(res.body.data.popularItems)).toBe(true);
    expect(Array.isArray(res.body.data.byDate)).toBe(true);
  });
});
