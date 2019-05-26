/* global describe context it before beforeEach after afterEach */

import {Injector} from "../../src/models/injector/Injector";
import supertest from "supertest";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import { TestStationService } from "../../src/services/TestStationService";
import { TestStationDAO } from "../../src/models/TestStationDAO";
import { ITestStation } from "../../src/models/ITestStation";

const url = "http://localhost:3004/";
const request = supertest(url);

describe("test stations", () => {
  describe("getTestStation", () => {
    context("when database is populated", () => {
      let testStationService: TestStationService;
      const testStationData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));

      before((done) => {
        testStationService = Injector.resolve<TestStationService>(TestStationService, [TestStationDAO]);
        const mockBuffer = testStationData.slice();

        const batches: any = Array();
        while (mockBuffer.length > 0) {
          batches.push(mockBuffer.splice(0, 25));
        }

        batches.forEach((batch: ITestStation[]) => {
          testStationService.insertTestStationList(batch);
        });

        done();
      });

      it("should return all test stations in the database", (done) => {
        const expectedResponse = testStationData;

        request.get("test-stations")
          .end((err: any, res: any) => {
            if (err) { expect.fail(err); }
            expect(res.statusCode).to.equal(200);
            expect(res.headers["access-control-allow-origin"]).to.equal("*");
            expect(res.headers["access-control-allow-credentials"]).to.equal("true");
            expect(res.headers["X-Content-Type-Options"]).to.equal("nosniff");
            expect(res.headers.vary).to.equal("Origin");
            expect(res.headers["X-XSS-Protection"]).to.equal("1; mode=block");
            expect(res.body.length).to.equal(expectedResponse.length);
            done();
          });
      });

      after((done) => {
        const dataBuffer = testStationData;

        const batches = Array();
        while (dataBuffer.length > 0) {
          batches.push(dataBuffer.splice(0, 25));
        }

        batches.forEach((batch) => {
          testStationService.deleteTestStationsList(
            batch.map((item: ITestStation) => {
              return item.testStationId;
            })
          );
        });

        done();
      });
    });
  });

  context("when database is empty", () => {
    it("should return error code 404", (done) => {
      request.get("preparers").expect(404, done);
    });
  });

  beforeEach((done) => {
    setTimeout(done, 500);
  });
  afterEach((done) => {
    setTimeout(done, 500);
  });
});
