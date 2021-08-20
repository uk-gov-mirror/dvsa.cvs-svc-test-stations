import supertest from "supertest";
import { populateDatabase, emptyDatabase } from "../util/dbOperations";
import LambdaTester from "lambda-tester";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { getTestStations } from "../../src/functions/getTestStations";
const url = "http://localhost:3004/";
const request = supertest(url);

describe("test stations", () => {
  beforeAll(async () => {
    jest.restoreAllMocks();
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  describe("getTestStation Db is Up", () => {
    context("when database is empty", () => {
      it("should throw and error when requesting non-existent record", async () => {
        return LambdaTester(getTestStations).expectResolve((result: any) => {
          expect((result as HTTPResponse).statusCode).toEqual(404);
        });
      });
    });
  });
});
