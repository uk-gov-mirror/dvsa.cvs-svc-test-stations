import supertest from "supertest";
import {expect} from "chai";
import fs from "fs";
import path from "path";
import { TestStationService } from "../../src/services/TestStationService";
import { TestStationDAO } from "../../src/models/TestStationDAO";
import {ITestStation} from "../../src/models/ITestStation";
import stations from "../resources/test-stations.json";
const url = "http://localhost:3004/";
const request = supertest(url);

describe("test stations", () => {
  describe("getTestStation", () => {
    context("when database is populated", () => {
      let testStationService: any = null;
      let testStationDAO = null;
      const testStationData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));

      beforeEach((done) => {
        testStationDAO = new TestStationDAO();
        testStationService = new TestStationService(testStationDAO);
        const mockBuffer = [...stations].slice();

        const batches = [];
        while (mockBuffer.length > 0) {
          batches.push(mockBuffer.splice(0, 25));
        }

        batches.forEach((batch) => {
          testStationService.insertTestStationList(batch);
        });

        done();
      });

      it("should return all test stations in the database", (done) => {
        request.get("test-stations")
          .end((err: Error, res: any) => {
            if (err) { expect.fail(err); }
            expect(res.statusCode).to.equal(200);
            expect(res.headers["access-control-allow-origin"]).to.equal("*");
            expect(res.headers["access-control-allow-credentials"]).to.equal("true");
            expect(res.body.length).to.equal(stations.length);
            done();
          });
      });

      it("should return the selected Station's details", (done) => {
        const expectedResponse = [
          {
            testStationPNumber: "84-926821",
            testStationEmails: [
              "teststationname@dvsa.gov.uk",
              "teststationname1@dvsa.gov.uk"
            ],
            testStationId: "2"
          }
        ];

        request.get("test-stations/84-926821")
          .end((err, res: any) => {
            if (err) { expect.fail(err); }
            expect(res.statusCode).to.equal(200);
            expect(res.headers["access-control-allow-origin"]).to.equal("*");
            expect(res.headers["access-control-allow-credentials"]).to.equal("true");
            expect(res.body).to.deep.equal(expectedResponse);
            done();
          });
      });

      afterEach((done) => {
        const dataBuffer = testStationData;

        const batches = [];
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
