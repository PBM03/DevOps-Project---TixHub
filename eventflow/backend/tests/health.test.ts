import request from "supertest";
import app from "../src/app";

describe("Health API", () => {
  it("should return server status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);

    expect(response.body.status).toBe("Server Running");
  });
});