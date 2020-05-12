import AWS from "aws-sdk";
import {TestStationDAO} from "../../src/models/TestStationDAO";
import sinon, {SinonStub} from "sinon";
import {HTTPError} from "../../src/models/HTTPError";
import stations from "../resources/test-stations.json";
import {RESPONSE_STATUS, TEST_STATION_STATUS} from "../../src/utils/Enum";
import {Configuration} from "../../src/utils/Configuration";

const sandbox = sinon.createSandbox();

describe("TestStationDAO", () => {

    context("getAll", () => {
        beforeEach(() => {jest.resetModules(); });
        afterEach(() => {sandbox.restore(); });

        it("returns data on successful query", async () => {
            mockDocumentClientWithReturn("scan", "success");
            const dao = new TestStationDAO();
            const output = await dao.getAll(TEST_STATION_STATUS.ACTIVE);
            expect(output).toEqual(RESPONSE_STATUS.SUCCESS);
        });

        it("does not set filter test stations if the statusFilter is null", async () => {
            const stub = mockDocumentClientWithReturn("scan", "success");
            const dao = new TestStationDAO();
            await dao.getAll(null);
            expect(stub.args[0]).toStrictEqual( [ { TableName: Configuration.getInstance().getDynamoDBConfig().table}]);
        });

        it("throw error on failed query", async () => {
            const myError = new HTTPError(418, "It broke");
            mockDocumentClientWithReject("scan", myError);
            const dao = new TestStationDAO();
            try {
                await dao.getAll(TEST_STATION_STATUS.ACTIVE);
            } catch (e) {
                expect(e).toEqual(myError);
            }
        });
    });

    context("getTestStationEmailByPNumber", () => {
        beforeEach(() => {jest.resetModules(); });
        afterEach(() => {sandbox.restore(); });

        it("returns data on successful query", async () => {
            const stub = mockDocumentClientWithReturn("query", "success");
            const dao = new TestStationDAO();
            const testPNumber = "12-345678";
            const output = await dao.getTestStationEmailByPNumber(testPNumber);
            expect(output).toEqual("success");
            expect(stub.args[0][0].ExpressionAttributeValues).toStrictEqual({":testStationPNumber": testPNumber});
        });

        it("throws error on failed query", async () => {
            const myError = new HTTPError(418, "It broke");
            mockDocumentClientWithReject("query", myError);
            const dao = new TestStationDAO();
            try {
                await dao.getTestStationEmailByPNumber("12-345678");
            } catch (e) {
                expect(e).toEqual(myError);
            }
        });
    });

    context("createMultiple", () => {
        beforeEach(() => {jest.resetModules(); });
        afterEach(() => {sandbox.restore(); });

        it("builds correct query and returns data on successful query", async () => {
            const stub = mockDocumentClientWithReturn("batchWrite", "success");
            const expectedParams = [{
                PutRequest:
                  {
                      Item: stations[0]
                  }
            }];
            const dao = new TestStationDAO();
            const output = await dao.createMultiple([stations[0]]);
            expect(output).toEqual("success");
            expect(getRequestItemsBodyFromStub(stub)).toStrictEqual(expectedParams);
        });

        it("returns error on failed query", async () => {
            const myError = new HTTPError(418, "It broke");
            mockDocumentClientWithReject("batchWrite", myError);
            const dao = new TestStationDAO();
            try {
                await dao.createMultiple([stations[0]]);
            } catch (err) {
                expect(err).toEqual(myError);
            }
        });
    });

    context("createItem", () => {
        beforeEach(() => {jest.resetModules(); });
        afterEach(() => {sandbox.restore(); });

        it("builds correct query and returns data on successful query", async () => {
            const stub = mockDocumentClientWithReturn("put", "success");
            const expectedParams = stations[0];
            const dao = new TestStationDAO();
            const output = await dao.createItem(stations[0]);
            expect(output).toEqual("success");
            expect(stub.args[0][0].Item).toStrictEqual(expectedParams);
        });

        it("returns error on failed query", async () => {
            const myError = new HTTPError(418, "It broke");
            mockDocumentClientWithReject("put", myError);
            const dao = new TestStationDAO();
            try {
                const output = await dao.createItem(stations[0]);
            } catch (err) {
                expect(err).toEqual(myError);
            }
        });
    });

    context("deleteMultiple", () => {
        beforeEach(() => {jest.resetModules(); });
        afterEach(() => {sandbox.restore(); });

        it("builds correct query and returns data on successful query", async () => {
            const stub = mockDocumentClientWithReturn("batchWrite", "success");
            const expectedParams = [{
                DeleteRequest:
                    {
                        Key:
                            {
                                testStationId: "testItem"
                            }
                    }
            }];
            const dao = new TestStationDAO();
            const output = await dao.deleteMultiple(["testItem"]);
            expect(output).toEqual("success");
            expect(getRequestItemsBodyFromStub(stub)).toStrictEqual(expectedParams);
        });

        it("returns error on failed query", async () => {
            const myError = new HTTPError(418, "It broke");
            mockDocumentClientWithReject("batchWrite", myError);
            const dao = new TestStationDAO();
            try {
                const output = await dao.deleteMultiple(["testItem"]);
            } catch (err) {
                expect(err).toEqual(myError);
            }
        });
    });
});

const getRequestItemsBodyFromStub = (input: SinonStub) => {
    const requestItems = input.args[0][0].RequestItems;
    const table = Object.keys(requestItems)[0];
    return requestItems[table];
};

function mockDocumentClientWithReturn(method: "batchWrite" | "scan" | "query" | "put", retVal: any) {
    const myStub = sinon.stub().callsFake(() => {
        return {
            promise: sinon.fake.resolves(retVal)
        };
    });
    sandbox.replace(AWS.DynamoDB.DocumentClient.prototype, method, myStub);
    return myStub;
}
function mockDocumentClientWithReject(method: "batchWrite" | "scan" | "query" | "put", retVal: any) {
    const myStub = sinon.stub().callsFake(() => {
        return {
            promise: sinon.fake.rejects(retVal)
        };
    });
    sandbox.replace(AWS.DynamoDB.DocumentClient.prototype, method, myStub);
    return myStub;
}
