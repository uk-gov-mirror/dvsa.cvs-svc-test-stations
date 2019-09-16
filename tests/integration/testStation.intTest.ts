import supertest from "supertest";
import {expect} from "chai";
import {populateDatabase, emptyDatabase} from "../util/dbOperations";
import stations from "../resources/test-stations.json";
const url = "http://localhost:3004/";
const request = supertest(url);

jest.restoreAllMocks();
jest.resetModules();

describe("test stations", () => {
  beforeAll(async (done) => {
    await populateDatabase();
    setTimeout(done, 1000);
  });

  describe("getTestStation", () => {
    context("when database is populated", () => {
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
    beforeAll( async (done) => {
      await emptyDatabase();
      setTimeout(done, 1000);
    });

    it("should return error code 404", (done) => {
      request.get("test-stations").expect(404, done);
    });

    afterAll(async (done) => {
      await populateDatabase();
      setTimeout(done, 1000);
    });
  });

  beforeEach(() => {
    jest.setTimeout(5000);
  });
  afterEach(() => {
    jest.setTimeout(5000);
  });

});


