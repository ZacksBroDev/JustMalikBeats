import { afterEach, describe, expect, it, vi } from "vitest";

import paymentController from "../controllers/paymentController.js";
import Purchase from "../models/Purchase.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

const mockPurchaseLookup = (purchase) => {
  vi.spyOn(Purchase, "findOne").mockReturnValue({
    populate: vi.fn().mockResolvedValue(purchase),
  });
};

describe("download controller", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns not found for an invalid download token", async () => {
    mockPurchaseLookup(null);
    const response = createResponse();

    await paymentController.getDownloadLink(
      { params: { token: "missing-token" } },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      error: "Invalid download token",
    });
  });

  it("rejects an expired download link without saving the purchase", async () => {
    const purchase = {
      downloadExpiry: new Date(Date.now() - 1_000),
      downloadCount: 0,
      maxDownloads: 3,
      save: vi.fn(),
    };
    mockPurchaseLookup(purchase);
    const response = createResponse();

    await paymentController.getDownloadLink(
      { params: { token: "expired-token" } },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      error: "Download link has expired",
    });
    expect(purchase.save).not.toHaveBeenCalled();
  });

  it("rejects a download after the maximum count is reached", async () => {
    const purchase = {
      downloadExpiry: new Date(Date.now() + 60_000),
      downloadCount: 3,
      maxDownloads: 3,
      save: vi.fn(),
    };
    mockPurchaseLookup(purchase);
    const response = createResponse();

    await paymentController.getDownloadLink(
      { params: { token: "exhausted-token" } },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      error: "Maximum downloads reached",
    });
    expect(purchase.save).not.toHaveBeenCalled();
  });

  it("increments the count and returns the track download details", async () => {
    const purchase = {
      downloadExpiry: new Date(Date.now() + 60_000),
      downloadCount: 1,
      maxDownloads: 3,
      save: vi.fn().mockResolvedValue(),
      track: {
        audioFileUrl: "https://cdn.example.com/track.mp3",
        title: "Denver Nights",
        artist: "JustMalikBeats",
      },
    };
    mockPurchaseLookup(purchase);
    const response = createResponse();

    await paymentController.getDownloadLink(
      { params: { token: "valid-token" } },
      response,
    );

    expect(purchase.downloadCount).toBe(2);
    expect(purchase.save).toHaveBeenCalledOnce();
    expect(response.json).toHaveBeenCalledWith({
      downloadUrl: "https://cdn.example.com/track.mp3",
      track: { title: "Denver Nights", artist: "JustMalikBeats" },
      downloadsRemaining: 1,
      expiresAt: purchase.downloadExpiry,
    });
  });
});
