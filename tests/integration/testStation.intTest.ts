import supertest from "supertest";
import { expect } from "chai";
import { populateDatabase, emptyDatabase } from "../util/dbOperations";
import stations from "../resources/test-stations.json";
const url = "http://localhost:3004/";
const request = supertest(url);

describe("getTestStation", () => {
  beforeEach((done) => {
    populateDatabase();
    done();
  });

  afterEach((done) => {
    emptyDatabase();
    done();
  });

  afterAll((done) => {
    populateDatabase();
    done();
});

  context("when database is populated", () => {
    context("when fetching all records", () => {
      it("should return all test stations in the database", (done) => {
        request.get("test-stations")
          .end((err: Error, res: any) => {
            if (err) { expect.fail(err); }
            expect(res.statusCode).to.equal(200);
            expect(res.body.length).to.equal(stations.length);
            done();
          });
      });
    });

    context("when fetching selected record", () => {
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
            expect(res.body).to.deep.equal(expectedResponse);
            done();
          });
      });
    });
  });
});
