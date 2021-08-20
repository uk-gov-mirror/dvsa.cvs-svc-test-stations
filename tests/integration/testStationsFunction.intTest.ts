import LambdaTester from "lambda-tester";
import { getTestStations } from "../../src/functions/getTestStations";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
import testStations from "../resources/test-stations.json";

describe("getTestStations", () => {
  beforeAll(async () => {
    jest.restoreAllMocks();
    await emptyDatabase();
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  context("when database is populated", () => {
    it("should return only the active test stations", () => {
      return LambdaTester(getTestStations).expectResolve((result: any) => {
        expect(testStations).toHaveLength(20);
        expect(JSON.parse(result.body)).toHaveLength(19);
        expect(result.statusCode).toEqual(200);
      });
    });
  });
});
