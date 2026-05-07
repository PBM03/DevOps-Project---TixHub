import request from "supertest";
import app from "../src/app";
import User from "../src/models/User.model";

jest.mock("../src/models/User.model");

describe("Auth API", () => {

  it("should return invalid credentials for unknown user", async () => {

    (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "123456"
      });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

});