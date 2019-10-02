import { TestStationService } from "../../src/services/TestStationService";
import { getTestStations} from "../../src/functions/getTestStations";
import {HTTPError} from "../../src/models/HTTPError";
import { expect } from "chai";
import stations from "../resources/test-stations.json";
import mockContext from "aws-lambda-mock-context";
import {HTTPResponse} from "../../src/models/HTTPResponse";
const ctx = mockContext();

jest.mock("../../src/services/TestStationService");

describe("getTestStationsEmails Handler", () => {
    context("Service returns data", () => {
        it("returns response with data", async () => {
            TestStationService.prototype.getTestStationList = jest.fn().mockImplementation(() => {
                return Promise.resolve(stations);
            });

            try {
                const res: HTTPResponse | HTTPError = await getTestStations();
                expect(res).to.be.instanceOf(HTTPResponse);
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.equal(JSON.stringify(stations));
            } catch (e) {
                expect.fail();
            }
        });
    });

    context("Service throws error", () => {
        it("should throw that error upwards and ultimately return it", async () => {
            const errorMessage = "Bad thing happened";
            TestStationService.prototype.getTestStationList = jest.fn().mockImplementation(() => {
                return Promise.reject(new HTTPError(418, errorMessage));
            });

            try {
                const res = await getTestStations();
                expect(res).to.be.instanceOf(HTTPError);
                expect(res.statusCode).to.equal(418);
                expect(res.body).to.equal(errorMessage);
            } catch (e) {
                expect.fail();
            }
        });
    });
});
