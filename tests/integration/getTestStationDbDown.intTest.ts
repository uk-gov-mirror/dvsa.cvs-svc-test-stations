import supertest from "supertest";
import { expect } from "chai";
import { populateDatabase, emptyDatabase } from "../util/dbOperations";
import stations from "../resources/test-stations.json";
const url = "http://localhost:3004/";
const request = supertest(url);


describe("test stations", () => {
  beforeAll(async (done) => {
    await emptyDatabase();
    setTimeout(done, 30000);
    jest.resetAllMocks();
    jest.resetModules();
    done();
  });

  beforeEach(() => {
    jest.setTimeout(30000);
  });
  afterEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(async (done) => {
    await populateDatabase();
    setTimeout(done, 30000);
    done();
  });

  describe("getTestStation Db is down", () => {
    context("when database is empty", () => {
        it("should return error code 404", async (done) => {
          request.get("test-stations").expect(404, done);
          done();
        });
      });
  });
});


