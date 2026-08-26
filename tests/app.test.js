import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import createApp from "../app.js";

const app = createApp({ isProduction: false });

describe("Express application", () => {
  it("reports application health without external services", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      stripe: "not configured",
      environment: "development",
    });
  });

  it("requires authentication for the current-user endpoint", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Access denied. No token provided.",
    });
  });

  it("requires admin authentication to create a track", async () => {
    const response = await request(app)
      .post("/api/tracks")
      .send({ title: "Unauthorized track" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Access denied. No token provided.",
    });
  });

  it("passes the raw body to Stripe webhook verification", async () => {
    const constructEvent = vi.fn(() => ({ type: "customer.created" }));
    const webhookApp = createApp({
      isProduction: false,
      stripe: { webhooks: { constructEvent } },
    });

    await request(webhookApp)
      .post("/api/payments/webhook")
      .set("stripe-signature", "valid-signature")
      .send({ id: "evt_test" });

    expect(constructEvent).toHaveBeenCalledOnce();
    expect(Buffer.isBuffer(constructEvent.mock.calls[0][0])).toBe(true);
  });
});
