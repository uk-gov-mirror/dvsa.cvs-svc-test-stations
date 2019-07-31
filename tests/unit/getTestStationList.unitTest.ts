/* global describe it context */
import { TestStationService } from "../../src/services/TestStationService";
import { TestStationDAOMock} from "../models/TestStationDAOMock";
import { HTTPError } from "../../src/models/HTTPError";
import { expect } from "chai";
import {Injector} from "../../src/models/injector/Injector";
import stations from "../resources/test-stations.json";

describe("getTestStationList", () => {
  describe("when database is on", () => {
    context("database call returns valid data", () => {
      it("should return the expected data", () => {
        const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
        TestStationDAOMock.testStationRecordsMock = [...stations];
        TestStationDAOMock.numberOfRecords = 20;
        TestStationDAOMock.numberOfScannedRecords = 20;

        return testStationService.getTestStationList()
          .then((returnedRecords: any) => {
            // console.log("*** ",returnedRecords.length);
            expect(returnedRecords.length).to.equal(20);
          });
      });
    });
    context("database call returns empty data", () => {
      it("should return error 404", () => {
        const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
        TestStationDAOMock.testStationRecordsMock = {...stations};
        TestStationDAOMock.numberOfRecords = 0;
        TestStationDAOMock.numberOfScannedRecords = 0;

        return testStationService.getTestStationList()
          .then(() => {
            expect.fail();
          }).catch((errorResponse: any) => {
            expect(errorResponse).to.be.instanceOf(HTTPError);
            expect(errorResponse.statusCode).to.equal(404);
            expect(errorResponse.body).to.equal("No resources match the search criteria.");
          });
      });
    });
  });

  describe("when database is off", () => {
    it("should return error 500", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.testStationRecordsMock = {...stations};
      TestStationDAOMock.numberOfRecords = 20;
      TestStationDAOMock.numberOfScannedRecords = 20;
      TestStationDAOMock.isDatabaseOn = false;

      return testStationService.getTestStationList()
        .then(() => {return; })
        .catch((errorResponse: any) => {
          expect(errorResponse).to.be.instanceOf(HTTPError);
          expect(errorResponse.statusCode).to.be.equal(500);
          expect(errorResponse.body).to.equal("Internal Server Error");
        });
    });
  });
});
