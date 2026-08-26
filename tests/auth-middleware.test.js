import { describe, expect, it, vi } from "vitest";
import auth from "../middleware/auth.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

describe("authentication middleware", () => {
  describe("verifyToken", () => {
    it("rejects a request without a token", () => {
      const request = { headers: {} };
      const response = createResponse();
      const next = vi.fn();

      auth.verifyToken(request, response, next);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({
        error: "Access denied. No token provided.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("attaches the decoded user for a valid bearer token", () => {
      const token = auth.generateToken("user-123", "user");
      const request = { headers: { authorization: `Bearer ${token}` } };
      const response = createResponse();
      const next = vi.fn();

      auth.verifyToken(request, response, next);

      expect(request.user).toMatchObject({ id: "user-123", role: "user" });
      expect(next).toHaveBeenCalledOnce();
      expect(response.status).not.toHaveBeenCalled();
    });
  });

  describe("requireAdmin", () => {
    it("allows an admin user to continue", () => {
      const request = { user: { id: "admin-123", role: "admin" } };
      const response = createResponse();
      const next = vi.fn();

      auth.requireAdmin(request, response, next);

      expect(next).toHaveBeenCalledOnce();
      expect(response.status).not.toHaveBeenCalled();
    });

    it("rejects a non-admin user", () => {
      const request = { user: { id: "user-123", role: "user" } };
      const response = createResponse();
      const next = vi.fn();

      auth.requireAdmin(request, response, next);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({
        error: "Access denied. Admin privileges required.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("optionalAuth", () => {
    it("allows unauthenticated requests to continue", () => {
      const request = { headers: {} };
      const response = createResponse();
      const next = vi.fn();

      auth.optionalAuth(request, response, next);

      expect(request.user).toBeUndefined();
      expect(next).toHaveBeenCalledOnce();
      expect(response.status).not.toHaveBeenCalled();
    });

    it("attaches a user when an optional bearer token is valid", () => {
      const token = auth.generateToken("user-456", "user");
      const request = { headers: { authorization: `Bearer ${token}` } };
      const response = createResponse();
      const next = vi.fn();

      auth.optionalAuth(request, response, next);

      expect(request.user).toMatchObject({ id: "user-456", role: "user" });
      expect(next).toHaveBeenCalledOnce();
      expect(response.status).not.toHaveBeenCalled();
    });
  });
});
