import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandOutput,
  QueryCommand,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { TestStationDAO } from "../../src/models/TestStationDAO";
import { HTTPError } from "../../src/models/HTTPError";
import stations from "../resources/test-stations.json";
import { RESPONSE_STATUS } from "../../src/utils/Enum";

describe("TestStationDAO", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });
  context("getAll", () => {
    it("returns data on successful query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(ScanCommand)
        .resolves("success" as unknown as ScanCommandOutput);
      const dao = new TestStationDAO();
      const output = await dao.getAll();
      expect(output).toEqual(RESPONSE_STATUS.SUCCESS);
    });

    it("throw error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(ScanCommand).rejects(myError);
      const dao = new TestStationDAO();
      try {
        await dao.getAll();
      } catch (e) {
        expect(e).toEqual(myError);
      }
    });
  });

  context("getTestStationEmailByPNumber", () => {
    it("returns data on successful query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(QueryCommand)
        .resolves("success" as unknown as QueryCommandOutput);
      const dao = new TestStationDAO();
      const testPNumber = "12-345678";
      const output = await dao.getTestStationEmailByPNumber(testPNumber);
      const stub = mockDynamoClient.commandCalls(QueryCommand);
      expect(output).toEqual("success");
      expect(stub[0].args[0].input.ExpressionAttributeValues).toEqual({
        ":testStationPNumber": testPNumber,
      });
    });

    it("throws error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(QueryCommand).rejects(myError);
      const dao = new TestStationDAO();
      try {
        await dao.getTestStationEmailByPNumber("12-345678");
      } catch (e) {
        expect(e).toEqual(myError);
      }
    });
  });

  context("putItem", () => {
    it("builds correct query and returns data on successful query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(QueryCommand)
        .resolves("success" as unknown as QueryCommandOutput);
      mockDynamoClient
        .on(PutCommand)
        .resolves("success" as unknown as PutCommandOutput);
      const expectedParams = stations[0];
      const dao = new TestStationDAO();
      const output = await dao.putItem(stations[0]);
      const putStub = mockDynamoClient.commandCalls(PutCommand);
      expect(output).toEqual("success");
      expect(putStub[0].args[0].input.Item).toStrictEqual(expectedParams);
    });

    it("returns error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(QueryCommand)
        .resolves("success" as unknown as QueryCommandOutput);
      mockDynamoClient.on(PutCommand).rejects(myError);

      const dao = new TestStationDAO();
      try {
        await dao.putItem(stations[0]);
      } catch (err) {
        expect(err).toEqual(myError);
      }
    });
  });
});
