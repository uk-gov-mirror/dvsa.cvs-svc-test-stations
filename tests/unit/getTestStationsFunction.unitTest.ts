import { TestStationService } from "../../src/services/TestStationService";
import { getTestStations } from "../../src/functions/getTestStations";
import { HTTPError } from "../../src/models/HTTPError";
import stations from "../resources/test-stations.json";
import mockContext from "aws-lambda-mock-context";
import { HTTPResponse } from "../../src/models/HTTPResponse";
const ctx = mockContext();

jest.mock("../../src/services/TestStationService");

describe("getTestStationsEmails Handler", () => {
  context("Service returns data", () => {
    it("returns response with data", async () => {
      TestStationService.prototype.getTestStationList = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve(stations);
        });
      const res: HTTPResponse | HTTPError = await getTestStations();
      expect(res).toBeInstanceOf(HTTPResponse);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(JSON.stringify(stations));
    });
  });

  context("Service throws error", () => {
    it("should throw that error upwards and ultimately return it", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.getTestStationList = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject(new HTTPError(418, errorMessage));
        });
      const res = await getTestStations();
      expect(res).toBeInstanceOf(HTTPError);
      expect(res.statusCode).toEqual(418);
      expect(res.body).toEqual(errorMessage);
    });
  });
});
