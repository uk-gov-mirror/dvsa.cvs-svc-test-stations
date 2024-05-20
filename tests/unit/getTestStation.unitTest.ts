import { TestStationService } from "../../src/services/TestStationService";
import { HTTPError } from "../../src/models/HTTPError";
import stations from "../resources/test-stations.json";
import mockContext, { Context } from "aws-lambda";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { getTestStation } from "../../src/functions/getTestStation";
import { ERRORS } from "../../src/utils/Enum";
const ctx = mockContext as Context;

jest.mock("../../src/services/TestStationService");

describe("getTestStation Handler", () => {
  context("with valid event", () => {
    it("parses event correctly and returns response with data", async () => {
      const station = stations[0];
      const testPNumber = "12-345678";
      const mockFunction = (input: string) => {
        expect(input).toEqual(testPNumber);
        return Promise.resolve(station);
      };
      TestStationService.prototype.getTestStation = jest
        .fn()
        .mockImplementation(mockFunction);

      const event = { pathParameters: { testStationPNumber: testPNumber } };
      const res: HTTPResponse = await getTestStation(event, ctx, () => {
        return;
      });

      expect(res).toBeInstanceOf(HTTPResponse);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(JSON.stringify(station));
    });
  });

  context("with invalid event", () => {
    it("returns an error without invoking the service", async () => {
      const event = { invalid: true };
      try {
        await getTestStation(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
    it("triggers validation when path parameters is null", async () => {
      const event = { pathParameters: null };
      try {
        await getTestStation(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });

    it("triggers validation when path parameters testPNumber is null", async () => {
      const event = { pathParameters: { testStationPNumber: null } };
      try {
        await getTestStation(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
    it("triggers validation when path parameters testPNumber is undefined", async () => {
      const event = { pathParameters: { testStationPNumber: undefined } };
      try {
        await getTestStation(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
    it("triggers validation when path parameters testPNumber is empty string", async () => {
      const event = { pathParameters: { testStationPNumber: " " } };
      try {
        await getTestStation(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
  });

  context("Service throws error", () => {
    it("should throw that HTTP error upwards", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.getTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject(new HTTPError(418, errorMessage));
        });
      const event = { pathParameters: { testStationPNumber: "12-345678" } };
      try {
        await getTestStation(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(418);
        expect((e as HTTPError).body).toEqual(errorMessage);
      }
    });

    it("should throw that error upwards", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.getTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject(new Error(errorMessage));
        });
      const event = { pathParameters: { testStationPNumber: "12-345678" } };
      try {
        await getTestStation(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(500);
        expect((e as HTTPError).body).toEqual(ERRORS.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
