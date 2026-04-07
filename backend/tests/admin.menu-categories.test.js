import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { createAdmin, createCategory, createMenuItem, tokenForUser } from "./helpers/factories.js";

describe("Admin Menu & Categories API", () => {
  it("POST /api/v1/admin/categories creates category", async () => {
    const admin = await createAdmin({ studentId: "ADM7001" });
    const adminToken = tokenForUser(admin);

    const res = await request(app)
      .post("/api/v1/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Rice", description: "Rice items" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Rice");
  });

  it("POST /api/v1/admin/categories rejects duplicate category", async () => {
    const admin = await createAdmin({ studentId: "ADM7002" });
    const adminToken = tokenForUser(admin);
    await createCategory({ name: "Duplicate Category" });

    const res = await request(app)
      .post("/api/v1/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Duplicate Category", description: "Dupe" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("PUT /api/v1/admin/categories/:id updates category", async () => {
    const admin = await createAdmin({ studentId: "ADM7003" });
    const adminToken = tokenForUser(admin);
    const category = await createCategory({ name: "Old Category" });

    const res = await request(app)
      .put(`/api/v1/admin/categories/${category._id.toString()}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Category" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Category");
  });

  it("POST /api/v1/admin/menu validates required fields", async () => {
    const admin = await createAdmin({ studentId: "ADM7004" });
    const adminToken = tokenForUser(admin);

    const res = await request(app)
      .post("/api/v1/admin/menu")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Incomplete Item");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/required fields/i);
  });

  it("POST /api/v1/admin/menu creates menu item with image upload", async () => {
    const admin = await createAdmin({ studentId: "ADM7005" });
    const adminToken = tokenForUser(admin);
    const category = await createCategory({ name: "Lunch" });

    const res = await request(app)
      .post("/api/v1/admin/menu")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Chicken Burger")
      .field("description", "Grilled chicken burger")
      .field("category", category._id.toString())
      .field("price", "120")
      .field("preparationTime", "12")
      .field("isAvailable", "true")
      .attach("image", Buffer.from("fake-image-content"), {
        filename: "burger.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Chicken Burger");
    expect(res.body.data.imageUrl).toContain("mock.cloudinary.test");
  });

  it("PUT /api/v1/admin/menu/:id updates menu item", async () => {
    const admin = await createAdmin({ studentId: "ADM7006" });
    const adminToken = tokenForUser(admin);
    const category = await createCategory({ name: "Meals" });
    const menuItem = await createMenuItem({ category, name: "Old Meal", price: 140 });

    const res = await request(app)
      .put(`/api/v1/admin/menu/${menuItem._id.toString()}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Updated Meal")
      .field("price", "160")
      .field("preparationTime", "18");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Meal");
    expect(res.body.data.price).toBe(160);
  });

  it("PATCH /api/v1/admin/menu/:id/availability toggles availability", async () => {
    const admin = await createAdmin({ studentId: "ADM7007" });
    const adminToken = tokenForUser(admin);
    const menuItem = await createMenuItem({ isAvailable: true });

    const res = await request(app)
      .patch(`/api/v1/admin/menu/${menuItem._id.toString()}/availability`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isAvailable).toBe(false);
  });

  it("DELETE /api/v1/admin/categories/:id fails when category is in use", async () => {
    const admin = await createAdmin({ studentId: "ADM7008" });
    const adminToken = tokenForUser(admin);
    const category = await createCategory({ name: "In Use" });
    await createMenuItem({ category, name: "Used Item" });

    const res = await request(app)
      .delete(`/api/v1/admin/categories/${category._id.toString()}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/cannot delete category/i);
  });

  it("DELETE /api/v1/admin/menu/:id then DELETE /api/v1/admin/categories/:id succeeds", async () => {
    const admin = await createAdmin({ studentId: "ADM7009" });
    const adminToken = tokenForUser(admin);
    const category = await createCategory({ name: "Temp Category" });
    const menuItem = await createMenuItem({ category, name: "Temp Item" });

    const deleteMenuRes = await request(app)
      .delete(`/api/v1/admin/menu/${menuItem._id.toString()}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteMenuRes.status).toBe(200);
    expect(deleteMenuRes.body.success).toBe(true);

    const deleteCategoryRes = await request(app)
      .delete(`/api/v1/admin/categories/${category._id.toString()}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteCategoryRes.status).toBe(200);
    expect(deleteCategoryRes.body.success).toBe(true);
  });

  it("PUT /api/v1/admin/categories/:id returns 404 for unknown category", async () => {
    const admin = await createAdmin({ studentId: "ADM7010" });
    const adminToken = tokenForUser(admin);
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put(`/api/v1/admin/categories/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "No Category" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
