import LambdaTester from "lambda-tester";
import { populateDatabase, emptyDatabase } from "../util/dbOperations";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { getTestStations } from "../../src/functions/getTestStations";
const url = "http://localhost:3004/";

describe("test stations", () => {
  beforeAll(async () => {
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
