import supertest from "supertest";
import {expect} from "chai";
import {populateDatabase, emptyDatabase} from "../util/dbOperations";
import stations from "../resources/test-stations.json";
const url = "http://localhost:3004/";
const request = supertest(url);

describe("test stations", () => {
  beforeAll(async (done) => {
    jest.setTimeout(30000);
    jest.resetAllMocks();
    jest.resetModules();
    await populateDatabase();
    setTimeout(done,20000);
  });

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterEach(() => {
    jest.setTimeout(30000);
  });

  describe("getTestStation", () => {
    context("when database is populated", () => {
      it("should return all test stations in the database", async (done) => {
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

      it("should return the selected Station's details", async (done) => {
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

});


