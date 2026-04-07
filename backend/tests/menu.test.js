import request from "supertest";
import app from "../src/app.js";
import { createCategory, createMenuItem } from "./helpers/factories.js";

describe("Menu API", () => {
  it("GET /api/v1/menu returns paginated menu items", async () => {
    const category = await createCategory({ name: "Lunch" });
    await createMenuItem({ category, name: "Burger" });
    await createMenuItem({ category, name: "Fries" });

    const res = await request(app).get("/api/v1/menu?page=1&limit=10");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.total).toBe(2);
  });

  it("GET /api/v1/menu supports category and price filters", async () => {
    const categoryA = await createCategory({ name: "Breakfast" });
    const categoryB = await createCategory({ name: "Dinner" });

    await createMenuItem({ category: categoryA, name: "Toast", price: 50 });
    await createMenuItem({ category: categoryB, name: "Steak", price: 500 });

    const res = await request(app).get(
      `/api/v1/menu?category=${categoryA._id.toString()}&minPrice=40&maxPrice=100`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].name).toBe("Toast");
  });

  it("GET /api/v1/menu/categories returns category list", async () => {
    await createCategory({ name: "Snacks" });
    await createCategory({ name: "Drinks" });

    const res = await request(app).get("/api/v1/menu/categories");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
  });

  it("GET /api/v1/menu/:id returns single menu item", async () => {
    const category = await createCategory({ name: "Desserts" });
    const menuItem = await createMenuItem({ category, name: "Cake" });

    const res = await request(app).get(`/api/v1/menu/${menuItem._id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Cake");
  });

  it("GET /api/v1/menu/search requires q query", async () => {
    const res = await request(app).get("/api/v1/menu/search");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/search query/i);
  });

  it("GET /api/v1/menu/search returns available matching items", async () => {
    const category = await createCategory({ name: "Burgers" });
    await createMenuItem({
      category,
      name: "Chicken Burger",
      description: "Grilled burger",
      isAvailable: true,
    });
    await createMenuItem({
      category,
      name: "Chicken Burger Hidden",
      description: "Unavailable burger",
      isAvailable: false,
    });

    const res = await request(app).get("/api/v1/menu/search?q=chicken");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].name).toContain("Chicken Burger");
  });
});
