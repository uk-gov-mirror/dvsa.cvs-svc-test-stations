import {ITestStation} from "../../src/models/ITestStation";
import { TestStationService } from "../../src/services/TestStationService";
import { TestStationDAOMock } from "../models/TestStationDAOMock";
import {HTTPError} from "../../src/models/HTTPError";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import {Injector} from "../../src/models/injector/Injector";

describe("deleteTestStationsList", () => {
  afterEach(() => {
    TestStationDAOMock.testStationRecordsMock = null;
    TestStationDAOMock.unprocessedItems = null;
  });

  context("database call deletes items", () => {
    it("should return nothing", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);

      TestStationDAOMock.testStationRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));

      return testStationService.deleteTestStationsList(TestStationDAOMock.testStationRecordsMock)
        .then((data: ITestStation[]) => {
          expect(data).to.equal(undefined);
        });
    });

    it("should return the unprocessed items", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.unprocessedItems = TestStationDAOMock.testStationRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));

      return testStationService.deleteTestStationsList(TestStationDAOMock.testStationRecordsMock)
        .then((data: ITestStation[]) => {
          expect(data.length).to.equal(20);
        });
    });
  });

  context("database call fails deleting items", () => {
    it("should return error 500", () => {
      const testStationService: TestStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAOMock]);
      TestStationDAOMock.testStationRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));
      TestStationDAOMock.isDatabaseOn = false;

      return testStationService.deleteTestStationsList(TestStationDAOMock.testStationRecordsMock)
        .then(() => {return; })
        .catch((errorResponse: HTTPError) => {
          expect(errorResponse).to.be.instanceOf(HTTPError);
          expect(errorResponse.statusCode).to.be.equal(500);
          expect(errorResponse.body).to.equal("Internal Server Error");
        });
    });
  });
});
