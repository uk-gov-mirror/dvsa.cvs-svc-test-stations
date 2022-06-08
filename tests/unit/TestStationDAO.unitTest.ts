import AWS from "aws-sdk";
import { TestStationDAO } from "../../src/models/TestStationDAO";
import sinon, { SinonStub } from "sinon";
import { HTTPError } from "../../src/models/HTTPError";
import stations from "../resources/test-stations.json";
import { RESPONSE_STATUS, TEST_STATION_STATUS } from "../../src/utils/Enum";
import { Configuration } from "../../src/utils/Configuration";

const sandbox = sinon.createSandbox();

describe("TestStationDAO", () => {
  context("getAll", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    afterEach(() => {
      sandbox.restore();
    });

    it("returns data on successful query", async () => {
      mockDocumentClientWithReturn("scan", "success");
      const dao = new TestStationDAO();
      const output = await dao.getAll();
      expect(output).toEqual(RESPONSE_STATUS.SUCCESS);
    });

    it("throw error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      mockDocumentClientWithReject("scan", myError);
      const dao = new TestStationDAO();
      try {
        await dao.getAll();
      } catch (e) {
        expect(e).toEqual(myError);
      }
    });
  });

  context("getTestStationEmailByPNumber", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    afterEach(() => {
      sandbox.restore();
    });

    it("returns data on successful query", async () => {
      const stub = mockDocumentClientWithReturn("query", "success");
      const dao = new TestStationDAO();
      const testPNumber = "12-345678";
      const output = await dao.getTestStationEmailByPNumber(testPNumber);
      expect(output).toEqual("success");
      expect(stub.args[0][0].ExpressionAttributeValues).toStrictEqual({
        ":testStationPNumber": testPNumber,
      });
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

  context("putItem", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    afterEach(() => {
      sandbox.restore();
    });

    it("builds correct query and returns data on successful query", async () => {
      const putstub = mockDocumentClientWithReturn("put", "success");
      mockDocumentClientWithReturn("query", "success");
      const expectedParams = stations[0];
      const dao = new TestStationDAO();
      const output = await dao.putItem(stations[0]);
      expect(output).toEqual("success");
      expect(putstub.args[0][0].Item).toStrictEqual(expectedParams);
    });

    it("returns error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      mockDocumentClientWithReject("put", myError);
      mockDocumentClientWithReturn("query", "success");
      const dao = new TestStationDAO();
      try {
        const output = await dao.putItem(stations[0]);
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

function mockDocumentClientWithReturn(
  method: "batchWrite" | "scan" | "query" | "put" | "transactWrite",
  retVal: any
) {
  const myStub = sinon.stub().callsFake(() => {
    return {
      promise: sinon.fake.resolves(retVal),
    };
  });
  sandbox.replace(AWS.DynamoDB.DocumentClient.prototype, method, myStub);
  return myStub;
}
function mockDocumentClientWithReject(
  method: "batchWrite" | "scan" | "query" | "put" | "transactWrite",
  retVal: any
) {
  const myStub = sinon.stub().callsFake(() => {
    return {
      promise: sinon.fake.rejects(retVal),
    };
  });
  sandbox.replace(AWS.DynamoDB.DocumentClient.prototype, method, myStub);
  return myStub;
}
