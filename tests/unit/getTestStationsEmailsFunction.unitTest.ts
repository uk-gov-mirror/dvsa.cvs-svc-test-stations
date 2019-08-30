import { TestStationService } from "../../src/services/TestStationService";
import { getTestStationsEmails} from "../../src/functions/getTestStationsEmails";
import {HTTPError} from "../../src/models/HTTPError";
import { expect } from "chai";
import stations from "../resources/test-stations.json";
import mockContext from "aws-lambda-mock-context";
import {HTTPResponse} from "../../src/models/HTTPResponse";
const ctx = mockContext();

jest.mock("../../src/services/TestStationService");

describe("getTestStationsEmails Handler", () => {
    context("with valid event", () => {
        it("parses event correctly and returns response with data", async () => {
            const emails = stations[0].testStationEmails;
            const testPNumber = "12-345678";
            const mockFunction = (input: string) => {
                expect(input).to.equal(testPNumber);
                return Promise.resolve(emails);
            };
            TestStationService.prototype.getTestStationEmails = jest.fn().mockImplementation(mockFunction);

            const event = {pathParameters: {testStationPNumber: testPNumber}};
            try {
                const res: HTTPResponse = await getTestStationsEmails(event, ctx, () => {return; });
                expect(res).to.be.instanceOf(HTTPResponse);
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.equal(JSON.stringify(emails));
            } catch (e) {
                expect.fail();
            }
        });
    });

    context("with invalid event", () => {
        it("returns an error without invoking the service", async () => {
            TestStationService.prototype.getTestStationEmails = jest.fn().mockImplementation(() => expect.fail());
            const event = {invalid: true}; // Missing pathParameters
            try {
                await getTestStationsEmails(event, ctx, () => {return; });
                expect.fail();
            } catch (e) {
                expect(e).to.be.instanceOf(HTTPError);
                expect(e.statusCode).to.equal(400);
            }
        });
    });

    context("Service throws error", () => {
        it("should throw that error upwards", async () => {
            const errorMessage = "Bad thing happened";
            TestStationService.prototype.getTestStationEmails = jest.fn().mockImplementation(() => {
                return Promise.reject(new HTTPError(418, errorMessage));
            });
            const event = {pathParameters: {testStationPNumber: "12-345678"}};
            try {
                await getTestStationsEmails(event, ctx, () => {return; });
                expect.fail();
            } catch (e) {
                expect(e).to.be.instanceOf(HTTPError);
                expect(e.statusCode).to.equal(418);
                expect(e.body).to.equal(errorMessage);
            }
        });
    });
});
