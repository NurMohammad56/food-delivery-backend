import request from "supertest";
import app from "../src/app.js";
import { createUser, tokenForUser } from "./helpers/factories.js";
import { hashResetToken } from "../src/utils/resetToken.js";

describe("Authentication API", () => {
  it("POST /api/v1/auth/register creates user and token", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Register User",
      email: "register@example.com",
      studentId: "SID2001",
      phone: "01711110000",
      password: "Password123!",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("register@example.com");
  });

  it("POST /api/v1/auth/register rejects duplicate email", async () => {
    await createUser({ email: "dupe@example.com", studentId: "SID9000" });

    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Duplicate User",
      email: "dupe@example.com",
      studentId: "SID9001",
      phone: "01712220000",
      password: "Password123!",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it("POST /api/v1/auth/login returns token for valid credentials", async () => {
    await createUser({
      email: "login@example.com",
      password: "Password123!",
      studentId: "SID2010",
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@example.com",
      password: "Password123!",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("POST /api/v1/auth/login rejects invalid credentials", async () => {
    await createUser({
      email: "wrong-pass@example.com",
      password: "Password123!",
      studentId: "SID2020",
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "wrong-pass@example.com",
      password: "WrongPassword!",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("POST /api/v1/auth/forgot-password sends reset response", async () => {
    await createUser({ email: "forgot@example.com", studentId: "SID2030" });

    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "forgot@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/reset email sent/i);
  });

  it("POST /api/v1/auth/reset-password/:resetToken resets password", async () => {
    const user = await createUser({
      email: "reset@example.com",
      password: "Password123!",
      studentId: "SID2040",
    });

    const resetToken = "valid-reset-token";
    user.resetPasswordToken = hashResetToken(resetToken);
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${resetToken}`)
      .send({ password: "NewPassword123!" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();

    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "reset@example.com",
      password: "NewPassword123!",
    });

    expect(loginRes.status).toBe(200);
  });

  it("POST /api/v1/auth/reset-password/:resetToken rejects invalid token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/reset-password/invalid-token")
      .send({ password: "NewPassword123!" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid or expired/i);
  });

  it("GET /api/v1/auth/me requires token", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/auth/me returns authenticated user", async () => {
    const user = await createUser({ email: "me@example.com", studentId: "SID2050" });
    const token = tokenForUser(user);

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("me@example.com");
  });
});
