import { TestStationService } from "../../src/services/TestStationService";
import { HTTPError } from "../../src/models/HTTPError";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { createTestStation } from "../../src/functions/createTestStation";

jest.mock("../../src/services/TestStationService");

describe("createTestStation Handler", () => {
  context("Service returns data", () => {
    it("returns response with data", async () => {
      TestStationService.prototype.insertTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve("all good");
        });
      const res: HTTPResponse | HTTPError = await createTestStation({});
      expect(res).toBeInstanceOf(HTTPResponse);
      expect(res.statusCode).toEqual(202);
      expect(res.body).toEqual(JSON.stringify("all good"));
    });
  });

  context("Service throws error", () => {
    it("should throw that error upwards and ultimately return it", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.insertTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject(new HTTPError(418, errorMessage));
        });
      try {
        await createTestStation({});
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect(e.statusCode).toEqual(418);
        expect(e.body).toEqual(errorMessage);
      }
    });
  });
});
