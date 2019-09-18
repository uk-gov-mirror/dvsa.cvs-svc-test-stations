import supertest from "supertest";
import { expect } from "chai";
import { populateDatabase, emptyDatabase } from "../util/dbOperations";
import stations from "../resources/test-stations.json";
const url = "http://localhost:3004/";
const request = supertest(url);


describe("test stations", () => {
    beforeEach((done) => {
        emptyDatabase();
        done();
    });

    afterEach((done) => {
        populateDatabase();
        done();
    });

    describe("getTestStation Db is Up", () => {
        context("when database is empty", () => {
            it("should return error code 404", (done) => {
                request.get("test-stations").expect(404, done);
                done();
            });
        });
    });
});


