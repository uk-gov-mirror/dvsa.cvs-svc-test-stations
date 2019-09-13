import supertest from "supertest";
import {expect} from "chai";
import { TestStationService } from "../../src/services/TestStationService";
import { TestStationDAO } from "../../src/models/TestStationDAO";
import {ITestStation} from "../../src/models/ITestStation";
import stations from "../resources/test-stations.json";
const url = "http://localhost:3004/";
const request = supertest(url);

describe("test stations", () => {
  const populateDatabase = () => {
    const testStationDAO = new TestStationDAO();
    const testStationService = new TestStationService(testStationDAO);
    const mockBuffer = [...stations].slice();

    const batches = [];
    while (mockBuffer.length > 0) {
      batches.push(mockBuffer.splice(0, 25));
    }

    return Promise.all(
      batches.map(async (batch) => {
        return await testStationService.insertTestStationList(batch);
      })
    );
  };

  const emptyDatabase = () => {
    const testStationDAO = new TestStationDAO();
    const testStationService = new TestStationService(testStationDAO);
    const dataBuffer = [...stations];

    const batches = [];
    while (dataBuffer.length > 0) {
      batches.push(dataBuffer.splice(0, 25));
    }
    return Promise.all(
      batches.map(async (batch) => {
        return await testStationService.deleteTestStationsList(
            batch.map((item: ITestStation) => {
              return item.testStationId;
            })
        );
      })
    );
  };

  describe("getTestStation", () => {
    context("when database is populated", () => {

      beforeEach(async () => {
        await populateDatabase();
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
    });
  });

  context("when database is empty", () => {
    beforeAll((done) => {
      emptyDatabase();
      done();
    });
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
  afterAll((done) => {
    populateDatabase();
    done();
  });
});


