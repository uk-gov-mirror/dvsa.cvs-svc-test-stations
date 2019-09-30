import LambdaTester from "lambda-tester";
import { getTestStations } from "../../src/functions/getTestStations";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";
import {expect} from "chai";
import {ITestStation} from "../../src/models/ITestStation";
import {HTTPError} from "../../src/models/HTTPError";

describe("getTestStations", () => {
  it("should return a promise", () => {
    return LambdaTester(getTestStations)
      .expectResolve((result: any) => {
        expect(result).to.exist;
      });
  });

  it("should return only the active test stations", () => {
    return LambdaTester(getTestStations)
      .expectResolve((result: any) => {
        expect(result).to.exist;
        expect(JSON.parse(result.body).length).to.equal(17);
      });
  });
});

describe("getTestStationsEmail", () => {
  it("should return an error when sending no parameters", () => {
    return LambdaTester(getTestStationsEmails)
        .expectReject((error: Error) => {
          expect(error).to.exist;
          expect(error).to.be.instanceOf(HTTPError);
          expect((error as HTTPError).statusCode).to.equal(400);
        });
  });
  it("should return a promise when sending parameters", () => {
    return LambdaTester(getTestStationsEmails)
        .event({
            pathParameters: {
            testStationPNumber: "87-1369569" }
        })
        .expectResolve((result: ITestStation[]) => {
          expect(result).to.exist;
        });
  });
  it("should throw and error when requesting non-existent record", () => {
    return LambdaTester(getTestStationsEmails)
        .event({
          pathParameters: {
            testStationPNumber: "111" }
        })
        .expectReject((error: Error) => {
          expect(error).to.exist;
          expect(error).to.be.instanceOf(HTTPError);
          expect((error as HTTPError).statusCode).to.equal(404);
        });
  });
});
