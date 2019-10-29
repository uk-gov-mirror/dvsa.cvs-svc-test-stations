import supertest from "supertest";
import LambdaTester from "lambda-tester";
import {getTestStations} from "../../src/functions/getTestStations";
import {HTTPResponse} from "../../src/models/HTTPResponse";
import {emptyDatabase, populateDatabase} from "../util/dbOperations";
const url = "http://localhost:3004/";
const request = supertest(url);

describe("getTestStation", () => {
  beforeEach(async () => {
    await emptyDatabase();
    await populateDatabase();
  });

  afterEach(async () => {
    await emptyDatabase();
  });

  beforeAll(async () => {
    await emptyDatabase();
    await populateDatabase();
  });

  afterAll(async () => {
    await emptyDatabase();
  });
  context("when database is populated", () => {
    context("when fetching all records", () => {
      it("should return all test stations in the database", async () => {
        return LambdaTester(getTestStations)
            .expectResolve((result: any) => {
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
              "teststationname1@dvsa.gov.uk"
            ],
            testStationId: "2"
          }
        ];

        const res = await request.get("test-stations/84-926821");
        expect(res.status).toEqual(200);
        expect(res.body).toStrictEqual(expectedResponse);
      });
    });
});
