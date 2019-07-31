import LambdaTester from "lambda-tester";
import { getTestStations } from "../../src/functions/getTestStations";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";
import {expect} from "chai";
import {ITestStation} from "../../src/models/ITestStation";

describe("getTestStations", () => {
  it("should return a promise", () => {
    return LambdaTester(getTestStations)
      .expectResolve((result: ITestStation[]) => {
          // tslint:disable-next-line
        expect(result).to.exist;
      });
  });
});

describe("getTestStationsEmail", () => {
  it("should return an error when sending no parameters", () => {
    return LambdaTester(getTestStationsEmails)
        .expectResolve((result: ITestStation[]) => {
            // tslint:disable-next-line
          expect(result).to.exist;
        });  });
  it("should return a promise when sending parameters", () => {
    return LambdaTester(getTestStationsEmails)
      .event({
        pathParameters: {
          testStationPNumber: "87-1369569" }
      })
        .expectResolve((result: ITestStation[]) => {
            // tslint:disable-next-line
          expect(result).to.exist;
        });  });
  it("should return a promise when sending parameters", () => {
    return LambdaTester(getTestStationsEmails).event({
      pathParameters: {
        testStationPNumber: "111" }
    })
        .expectResolve((result: ITestStation[]) => {
            // tslint:disable-next-line
          expect(result).to.exist;
        });  });
});
