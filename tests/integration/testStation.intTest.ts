import LambdaTester from "lambda-tester";
import { getTestStations } from "../../src/functions/getTestStations";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";

describe("getTestStation", () => {
  beforeAll(async () => {
    await emptyDatabase();
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  afterEach(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });
  context("when database is populated", () => {
    context("when fetching all records", () => {
      it("should return all test stations in the database", async () => {
        return LambdaTester(getTestStations).expectResolve((result: any) => {
          expect((result as HTTPResponse).statusCode).toEqual(200);
        });
      });
    });
  });

  context("when fetching selected record", () => {
    it("should return the selected Station's details", async () => {
      const expectedResponse = [
        {
          testStationPNumber: "84-926821",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
          ],
          testStationId: "2",
        },
      ];

      return LambdaTester(getTestStationsEmails)
        .event({
          pathParameters: {
            testStationPNumber: "84-926821",
          },
        })
        .expectResolve((result: any) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toStrictEqual(expectedResponse);
        });
    });
  });
});
