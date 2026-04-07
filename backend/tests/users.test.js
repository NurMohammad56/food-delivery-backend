import request from "supertest";
import app from "../src/app.js";
import { createUser, tokenForUser } from "./helpers/factories.js";

describe("Users API", () => {
  it("PUT /api/v1/users/profile updates user profile", async () => {
    const user = await createUser({ name: "Old Name", studentId: "SID3001" });
    const token = tokenForUser(user);

    const res = await request(app)
      .put("/api/v1/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Name", phone: "01733330000" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("New Name");
    expect(res.body.data.phone).toBe("01733330000");
  });

  it("POST /api/v1/users/avatar uploads avatar", async () => {
    const user = await createUser({ studentId: "SID3002" });
    const token = tokenForUser(user);

    const res = await request(app)
      .post("/api/v1/users/avatar")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", Buffer.from("fake-image-content"), {
        filename: "avatar.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.avatar).toContain("mock.cloudinary.test");
  });

  it("DELETE /api/v1/users/avatar deletes avatar", async () => {
    const user = await createUser({ studentId: "SID3003" });
    const token = tokenForUser(user);

    await request(app)
      .post("/api/v1/users/avatar")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", Buffer.from("fake-image-content"), {
        filename: "avatar.png",
        contentType: "image/png",
      });

    const res = await request(app)
      .delete("/api/v1/users/avatar")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("PUT /api/v1/users/change-password changes password", async () => {
    const user = await createUser({
      email: "change-pass@example.com",
      password: "Password123!",
      studentId: "SID3004",
    });
    const token = tokenForUser(user);

    const res = await request(app)
      .put("/api/v1/users/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Password123!",
        newPassword: "Password1234!",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "change-pass@example.com",
      password: "Password1234!",
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
  });

  it("PUT /api/v1/users/change-password rejects wrong current password", async () => {
    const user = await createUser({
      email: "wrong-current@example.com",
      password: "Password123!",
      studentId: "SID3005",
    });
    const token = tokenForUser(user);

    const res = await request(app)
      .put("/api/v1/users/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "BadPassword123!",
        newPassword: "Password1234!",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/incorrect/i);
  });
});
