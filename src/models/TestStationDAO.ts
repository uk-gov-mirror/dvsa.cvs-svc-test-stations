import { Configuration } from "../utils/Configuration";
import AWSXRay from "aws-xray-sdk";
import { BatchWriteItemOutput, DynamoDBClient, PutItemOutput, ScanOutput } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ITestStation } from "./ITestStation";
import { TEST_STATION_STATUS } from "../utils/Enum";
import { ServiceException } from "@smithy/smithy-client";

export class TestStationDAO {
  private static dbClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    const config: any = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.table;
    if (!TestStationDAO.dbClient) {
      let client;
      if (process.env._X_AMZN_TRACE_ID) {
        client = AWSXRay.captureAWSv3Client(new DynamoDBClient(config.params));
      } else {
        client =new DynamoDBClient(config.params);
      }
      TestStationDAO.dbClient = DynamoDBDocumentClient.from(client);
    }
  }

  /**
   * Get all email addresses for a given test station ID
   * @param testStationPNumber
   */
  public async getTestStationEmailByPNumber(testStationPNumber: string) {
    const params = {
      TableName: this.tableName,
      IndexName: "testStationPNumberIndex",
      KeyConditionExpression: "#testStationPNumber = :testStationPNumber",
      ExpressionAttributeNames: {
        "#testStationPNumber": "testStationPNumber",
      },
      ExpressionAttributeValues: {
        ":testStationPNumber": testStationPNumber,
      },
    };
    const command = new QueryCommand(params);

    return await TestStationDAO.dbClient.send(command);
  }

  /**
   * Get All test stations in the DB, filtered by status
   * If the statusFilter is set to null, get all test stations
   * @returns ultimately, an array of TestStation objects, wrapped in a PromiseResult, wrapped in a Promise
   */
  public async getAll(): Promise<ScanOutput | ServiceException> {
    const scanParams = { TableName: this.tableName };
    const filter = {
      FilterExpression:
        "#testStationStatus IN(:activeStatus, :terminationReqStatus) ",
      ExpressionAttributeNames: {
        "#testStationStatus": "testStationStatus",
      },
      ExpressionAttributeValues: {
        ":activeStatus": TEST_STATION_STATUS.ACTIVE,
        ":terminationReqStatus": TEST_STATION_STATUS.TERMINATION_REQUESTED,
      },
    };
    const command = new ScanCommand({ ...scanParams, ...filter });

    return await TestStationDAO.dbClient.send(command);
  }

  /**
   * Insert or update a Test Station in the DB.
   * @param testStationItem: ITestStation
   * @returns DynamoDB PutItemOutput, wrapped in promises
   */
  public async putItem(
    testStationItem: ITestStation
  ): Promise<PutItemOutput | ServiceException> {
    const pNumber = testStationItem.testStationPNumber;
    const testStationId: string = await this.getTestStaionIdByPNumber(pNumber);
    testStationItem.testStationId = testStationId
      ? testStationId
      : testStationItem.testStationId;
    const params = {
      TableName: this.tableName,
      Item: testStationItem,
    };
    const command = new PutCommand(params);
    return await TestStationDAO.dbClient.send(command);
  }

  /**
   * Get test station id by P number.
   * @param testStationPNumber: string
   * @returns Promise<string>, test station id
   */
  private async getTestStaionIdByPNumber(
    testStationPNumber: string
  ): Promise<string> {
    const params = {
      TableName: this.tableName,
      IndexName: "testStationPNumberIndex",
      KeyConditionExpression: "#testStationPNumber = :testStationPNumber",
      ExpressionAttributeNames: {
        "#testStationPNumber": "testStationPNumber",
      },
      ExpressionAttributeValues: {
        ":testStationPNumber": testStationPNumber,
      },
    };
    const command = new QueryCommand(params);
    const testStation = await TestStationDAO.dbClient.send(command);

    if (!testStation || !testStation.Items || testStation.Count === 0) {
      console.log("record not found for P Number: " + testStationPNumber);
      return "";
    }

    /* tslint:disable:no-string-literal */
    return testStation.Items[0]["testStationId"];
  }

  /**
   * Write data about multiple Test Stations to the DB. Only used by the integration tests.
   * @param testStationItems: ITestStation[]
   * @returns DynamoDB BatchWriteItemOutput, wrapped in promises
   */
  public async createMultiple(
    testStationItems: ITestStation[]
  ): Promise<BatchWriteItemOutput | ServiceException> {
    const params = this.generatePartialParams();

    testStationItems.map((testStationItem: ITestStation) => {
      params.RequestItems[this.tableName].push({
        PutRequest: {
          Item: testStationItem,
        },
      });
    });
    const command = new BatchWriteCommand(params);
    return await TestStationDAO.dbClient.send(command);
  }

  /**
   * Removes multiple Test Stations from the DB. Only used by the integration tests.
   * @param primaryKeysToBeDeleted
   */
  public async deleteMultiple(
    primaryKeysToBeDeleted: string[]
  ): Promise<BatchWriteItemOutput | ServiceException> {
    const params = this.generatePartialParams();

    primaryKeysToBeDeleted.forEach((key: string) => {
      params.RequestItems[this.tableName].push({
        DeleteRequest: {
          Key: {
            testStationId: key,
          },
        },
      });
    });
    const command = new BatchWriteCommand(params);

    return await TestStationDAO.dbClient.send(command);
  }

  /**
   * Internal method for getting a common parameter template
   */
  private generatePartialParams(): any {
    return {
      RequestItems: {
        [this.tableName]: Array(),
      },
    };
  }
}
