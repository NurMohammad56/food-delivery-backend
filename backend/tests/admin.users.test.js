import request from "supertest";
import app from "../src/app.js";
import { createAdmin, createUser, tokenForUser } from "./helpers/factories.js";

describe("Admin Users API", () => {
  it("GET /api/v1/users/admin/all forbids student role", async () => {
    const student = await createUser({ studentId: "SID6001" });
    const studentToken = tokenForUser(student);

    const res = await request(app)
      .get("/api/v1/users/admin/all")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/users/admin/all allows admin", async () => {
    const admin = await createAdmin({ email: "admin-users@example.com", studentId: "ADM6001" });
    const adminToken = tokenForUser(admin);
    await createUser({ email: "student-a@example.com", studentId: "SID6002" });

    const res = await request(app)
      .get("/api/v1/users/admin/all?page=1&limit=20")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
  });

  it("PUT /api/v1/users/admin/:id/role rejects invalid role", async () => {
    const admin = await createAdmin({ email: "admin-role-invalid@example.com", studentId: "ADM6002" });
    const adminToken = tokenForUser(admin);
    const user = await createUser({ studentId: "SID6003" });

    const res = await request(app)
      .put(`/api/v1/users/admin/${user._id.toString()}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "manager" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid role");
  });

  it("PUT /api/v1/users/admin/:id/role updates role", async () => {
    const admin = await createAdmin({ email: "admin-role-update@example.com", studentId: "ADM6003" });
    const adminToken = tokenForUser(admin);
    const user = await createUser({ studentId: "SID6004", role: "student" });

    const res = await request(app)
      .put(`/api/v1/users/admin/${user._id.toString()}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe("admin");
  });
});
