import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import paymentController from "../controllers/paymentController.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  send: vi.fn(),
  json: vi.fn(),
});

describe("Stripe webhook controller", () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
  });

  afterEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete global.stripe;
  });

  it("rejects a webhook when Stripe signature verification fails", async () => {
    global.stripe = {
      webhooks: {
        constructEvent: vi.fn(() => {
          throw new Error("Invalid signature");
        }),
      },
    };
    const response = createResponse();

    await paymentController.handleWebhook(
      {
        body: Buffer.from("{}"),
        headers: { "stripe-signature": "invalid-signature" },
      },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith(
      "Webhook Error: Invalid signature",
    );
  });

  it("acknowledges events that do not require application handling", async () => {
    global.stripe = {
      webhooks: {
        constructEvent: vi.fn(() => ({ type: "customer.created" })),
      },
    };
    const response = createResponse();

    await paymentController.handleWebhook(
      {
        body: Buffer.from("{}"),
        headers: { "stripe-signature": "valid-signature" },
      },
      response,
    );

    expect(response.json).toHaveBeenCalledWith({ received: true });
  });
});
