import {TestStationService } from "../../src/services/TestStationService";
import {TestStationDAOMock } from "../models/TestStationDAOMock";
import {HTTPError } from "../../src/models/HTTPError";
import {expect } from "chai";
import {Injector} from "../../src/models/injector/Injector";
import stations from "../resources/test-stations.json";

describe("insertTestStationList", () => {
  context("database call inserts items", () => {
    it("should return nothing", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.testStationRecordsMock = {...stations};

      return testStationService.insertTestStationList(TestStationDAOMock.testStationRecordsMock)
        .then((data: any) => {
          expect(data).to.equal(undefined);
        }).catch((e: any) => {
          expect.fail();
        });
    });

    it("should return the unprocessed items", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.unprocessedItems = [...stations];
      TestStationDAOMock.testStationRecordsMock = [...stations];

      return testStationService.insertTestStationList(TestStationDAOMock.testStationRecordsMock)
        .then((data: any) => {
          expect(data).to.have.length(20);
        });
    });
  });

  context("database call fails inserting items", () => {
    it("should return error 500", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.testStationRecordsMock = {...stations};
      TestStationDAOMock.isDatabaseOn = false;

      return testStationService.insertTestStationList(TestStationDAOMock.testStationRecordsMock)
        .then(() => {return; })
        .catch((errorResponse: any) => {
          expect(errorResponse).to.be.instanceOf(HTTPError);
          expect(errorResponse.statusCode).to.be.equal(500);
          expect(errorResponse.body).to.equal("Internal Server Error");
        });
    });
  });
});
