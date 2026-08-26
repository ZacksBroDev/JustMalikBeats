import { describe, expect, it } from "vitest";
import Purchase from "../models/Purchase.js";

describe("Purchase model", () => {
  it("allows a guest purchase without a user account", () => {
    const purchase = new Purchase({
      user: null,
      track: "507f1f77bcf86cd799439011",
      stripePaymentIntentId: "pi_test_guest_purchase",
      amount: 2.99,
      customerEmail: "guest@example.com",
    });

    const validationError = purchase.validateSync();

    expect(validationError).toBeUndefined();
  });

  it("starts new purchases with three available downloads", () => {
    const purchase = new Purchase({
      track: "507f1f77bcf86cd799439011",
      stripePaymentIntentId: "pi_test_download_defaults",
      amount: 2.99,
      customerEmail: "guest@example.com",
    });

    expect(purchase.downloadCount).toBe(0);
    expect(purchase.maxDownloads).toBe(3);
  });
});
