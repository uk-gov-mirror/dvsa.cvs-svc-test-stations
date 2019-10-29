import LambdaTester from "lambda-tester";
import {getTestStations} from "../../src/functions/getTestStations";
import {HTTPResponse} from "../../src/models/HTTPResponse";
import {emptyDatabase, populateDatabase} from "../util/dbOperations";

describe("getTestStations", () => {
    beforeEach(async () => {
        await emptyDatabase();
        await populateDatabase();
    });

    afterEach(async () => {
        await emptyDatabase();
    });

    beforeAll(async () => {
        await emptyDatabase();
        await populateDatabase();
    });

    afterAll(async () => {
        await emptyDatabase();
    });

    context("when database is populated", () => {
        it("should return a promise", () => {
            return LambdaTester(getTestStations)
                .expectResolve((result: any) => {
                    expect(result).toBeTruthy();
                });
        });

        it("should return only the active test stations", () => {
            return LambdaTester(getTestStations)
                .expectResolve((result: any) => {
                    expect(result).toBeTruthy();
                    expect((result as HTTPResponse).statusCode).toEqual(200);
                });
        });
    });
});
