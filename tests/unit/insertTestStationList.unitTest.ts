import { TestStationService } from "../../src/services/TestStationService";
import { TestStationDAOMock } from "../models/TestStationDAOMock";
import { ITestStation } from "../../src/models/ITestStation";
import { HTTPError} from "../../src/models/HTTPError";
import { expect } from "chai";
import {Injector} from "../../src/models/injector/Injector";

describe("insertTestStationList", () => {
  context("database call inserts items", () => {
    it("should return nothing", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.testStationRecordsMock = require("../resources/test-stations.json");

      return testStationService.insertTestStationList(TestStationDAOMock.testStationRecordsMock)
        .then((data: ITestStation[]) => {
          expect(data).to.equal(undefined);
        });
    });

    it("should return the unprocessed items", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.unprocessedItems = TestStationDAOMock.testStationRecordsMock = require("../resources/test-stations.json");

      return testStationService.insertTestStationList(TestStationDAOMock.testStationRecordsMock)
        .then((data: ITestStation[]) => {
          expect(data.length).to.equal(20);
        });
    });
  });

  context("database call fails inserting items", () => {
    it("should return error 500", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.testStationRecordsMock = require("../resources/test-stations.json");
      TestStationDAOMock.isDatabaseOn = false;

      return testStationService.insertTestStationList(TestStationDAOMock.testStationRecordsMock)
        .catch((errorResponse: HTTPError) => {
          expect(errorResponse).to.be.instanceOf(HTTPError);
          expect(errorResponse.statusCode).to.be.equal(500);
          expect(errorResponse.body).to.equal("Internal Server Error");
        });
    });
  });
});
