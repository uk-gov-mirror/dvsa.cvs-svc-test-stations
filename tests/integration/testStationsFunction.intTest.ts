import LambdaTester from "lambda-tester";
import { getTestStations } from "../../src/functions/getTestStations";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";
import {ITestStation} from "../../src/models/ITestStation";
import {HTTPError} from "../../src/models/HTTPError";
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

describe("getTestStationsEmail", () => {
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

      it("should return an error when sending no parameters", () => {
        return LambdaTester(getTestStationsEmails)
            .expectReject((error: Error) => {
              expect(error).toBeTruthy();
              expect(error).toBeInstanceOf(HTTPError);
              expect((error as HTTPError).statusCode).toEqual(400);
            });
      });
      it("should return a promise when sending parameters", () => {
        return LambdaTester(getTestStationsEmails)
            .event({
                pathParameters: {
                testStationPNumber: "87-1369569" }
            })
            .expectResolve((result: ITestStation[]) => {
              expect(result).toBeTruthy();
            });
      });
      it("should throw and error when requesting non-existent record", () => {
        return LambdaTester(getTestStationsEmails)
            .event({
              pathParameters: {
                testStationPNumber: "111" }
            })
            .expectReject((error: Error) => {
              expect(error).toBeTruthy();
              expect(error).toBeInstanceOf(HTTPError);
              expect((error as HTTPError).statusCode).toEqual(404);
            });
      });
});
