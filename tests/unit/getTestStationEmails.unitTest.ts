/* global describe it context */
import {HTTPError} from "../../src/models/HTTPError";
import {TestStationService} from "../../src/services/TestStationService";
import {TestStationDAOMock} from "../models/TestStationDAOMock";
import {expect} from "chai";
import {Injector} from "../../src/models/injector/Injector";

describe("getTestStationEmail", () => {

  describe("when database is on", () => {
    context("database call returns valid data", () => {
      it("should return the expected data", async () => {
        const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
        TestStationDAOMock.testStationRecordsMock = require("../resources/test-stations.json");
        TestStationDAOMock.numberOfRecords = 20;
        TestStationDAOMock.numberOfScannedRecords = 20;

        let returnedRecords: any = [];
        try {
          returnedRecords = await testStationService.getTestStationEmails("87-1369569");
          expect(returnedRecords.length).to.equal(3);
        } catch (e) {
          expect.fail();
        }
      });
    });
    context("database call returns no data", () => {
      it("should throw error", () => {
        const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
        TestStationDAOMock.testStationRecordsMock = require("../resources/test-stations.json");
        TestStationDAOMock.numberOfRecords = 0;
        TestStationDAOMock.numberOfScannedRecords = 0;

        return testStationService.getTestStationEmails("")
          .then(() => {return; })
          .catch((errorResponse: HTTPError) => {
            expect(errorResponse).to.be.instanceOf(HTTPError);
            expect(errorResponse.statusCode).to.be.equal(404);
            expect(errorResponse.body).to.equal("No resources match the search criteria.");
          });
      });
    });
  });
});
