import request from "supertest";
import app from "../src/app";
import Event from "../src/models/Event.model";

jest.mock("../src/models/Event.model");

describe("Event API", () => {

  it("should fetch events successfully", async () => {

    (Event.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        {
          title: "Music Concert"
        }
      ])
    });

    const response = await request(app)
      .get("/api/events");

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

});