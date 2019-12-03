import { populateDatabase, emptyDatabase } from "../util/dbOperations";
import LambdaTester from "lambda-tester";
import {HTTPResponse} from "../../src/models/HTTPResponse";
import {getTestStations} from "../../src/functions/getTestStations";

describe("test stations", () => {
    beforeAll(async () => {
        jest.restoreAllMocks();
        await emptyDatabase();
    });

    afterAll(async () => {
        await populateDatabase();
    });

    describe("getTestStation Db is Up", () => {
        context("when database is empty", () => {
            it("should throw and error when requesting non-existent record", async () => {
                return LambdaTester(getTestStations)
                    .expectResolve((result: any) => {
                        expect((result as HTTPResponse).statusCode).toEqual(404);
                    });
            });
        });
    });
});


