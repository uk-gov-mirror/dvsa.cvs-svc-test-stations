import lambdaTester from "lambda-tester";
import { getTestStations } from "../../src/functions/getTestStations";
import {expect} from "chai";

describe("getTestStations", () => {
  it("should return a promise", () => {
    const lambda = lambdaTester(getTestStations);
    return lambda.expectResolve((response: any) => {
      expect(response).to.exist;
    });
  });
});
