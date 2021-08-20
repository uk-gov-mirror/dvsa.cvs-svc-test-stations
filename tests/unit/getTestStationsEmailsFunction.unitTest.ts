import { TestStationService } from "../../src/services/TestStationService";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";
import { HTTPError } from "../../src/models/HTTPError";
import stations from "../resources/test-stations.json";
import mockContext from "aws-lambda-mock-context";
import { HTTPResponse } from "../../src/models/HTTPResponse";
const ctx = mockContext();

jest.mock("../../src/services/TestStationService");

describe("getTestStationsEmails Handler", () => {
  context("with valid event", () => {
    it("parses event correctly and returns response with data", async () => {
      const emails = stations[0].testStationEmails;
      const testPNumber = "12-345678";
      const mockFunction = (input: string) => {
        expect(input).toEqual(testPNumber);
        return Promise.resolve(emails);
      };
      TestStationService.prototype.getTestStationEmails = jest
        .fn()
        .mockImplementation(mockFunction);

      const event = { pathParameters: { testStationPNumber: testPNumber } };
      try {
        const res: HTTPResponse = await getTestStationsEmails(
          event,
          ctx,
          () => {
            return;
          }
        );
        expect(res).toBeInstanceOf(HTTPResponse);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(JSON.stringify(emails));
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
      }
    });
  });

  context("with invalid event", () => {
    it("returns an error without invoking the service", async () => {
      // TestStationService.prototype.getTestStationEmails = jest.fn().mockImplementation(() => expect.fail());
      const event = { invalid: true }; // Missing pathParameters
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect(e.statusCode).toEqual(400);
      }
    });
  });

  context("Service throws error", () => {
    it("should throw that error upwards", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.getTestStationEmails = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject(new HTTPError(418, errorMessage));
        });
      const event = { pathParameters: { testStationPNumber: "12-345678" } };
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect(e.statusCode).toEqual(418);
        expect(e.body).toEqual(errorMessage);
      }
    });
  });
});
