import { Configuration } from "../utils/Configuration";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { ITestStation } from "./ITestStation";
import { PromiseResult } from "aws-sdk/lib/request";
import { default as unwrappedAWS } from "aws-sdk";
import { TEST_STATION_STATUS } from "../utils/Enum";
/* workaround AWSXRay.captureAWS(...) call obscures types provided by the AWS sdk.
https://github.com/aws/aws-xray-sdk-node/issues/14
*/
/* tslint:disable */
let AWS: { DynamoDB: { DocumentClient: new (arg0: any) => DocumentClient } };
if (process.env._X_AMZN_TRACE_ID) {
  AWS = require("aws-xray-sdk").captureAWS(require("aws-sdk"));
} else {
  console.log("Serverless Offline detected; skipping AWS X-Ray setup");
  AWS = require("aws-sdk");
}
/* tslint:enable */

export class TestStationDAO {
  private static dbClient: DocumentClient;
  private readonly tableName: string;

  constructor() {
    const config: any = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.table;
    if (!TestStationDAO.dbClient) {
      TestStationDAO.dbClient = new AWS.DynamoDB.DocumentClient(config.params);
    }
  }

  /**
   * Get all email addresses for a given test station ID
   * @param testStationPNumber
   */
  public getTestStationEmailByPNumber(testStationPNumber: string) {
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

    return TestStationDAO.dbClient.query(params).promise();
  }

  /**
   * Get All test stations in the DB, filtered by status
   * If the statusFilter is set to null, get all test stations
   * @returns ultimately, an array of TestStation objects, wrapped in a PromiseResult, wrapped in a Promise
   */
  public getAll(): Promise<
    PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>
  > {
    let scanParams = { TableName: this.tableName };
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
    scanParams = { ...scanParams, ...filter };

    return TestStationDAO.dbClient.scan(scanParams).promise();
  }

  /**
   * Insert or update a Test Station in the DB.
   * @param testStationItem: ITestStation
   * @returns DynamoDB PutItemOutput, wrapped in promises
   */
  public async putItem(
    testStationItem: ITestStation
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWS.AWSError>> {
    const pNumber = testStationItem.testStationPNumber;
    const testStationId: string = await this.getTestStaionIdByPNumber(pNumber);
    testStationItem.testStationId = testStationId
      ? testStationId
      : testStationItem.testStationId;
    const params = {
      TableName: this.tableName,
      Item: testStationItem,
    };
    return TestStationDAO.dbClient.put(params).promise();
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
    const testStation = await TestStationDAO.dbClient.query(params).promise();

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
  public createMultiple(
    testStationItems: ITestStation[]
  ): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWS.AWSError>> {
    const params = this.generatePartialParams();

    testStationItems.map((testStationItem: ITestStation) => {
      params.RequestItems[this.tableName].push({
        PutRequest: {
          Item: testStationItem,
        },
      });
    });

    return TestStationDAO.dbClient.batchWrite(params).promise();
  }

  /**
   * Removes multiple Test Stations from the DB. Only used by the integration tests.
   * @param primaryKeysToBeDeleted
   */
  public deleteMultiple(
    primaryKeysToBeDeleted: string[]
  ): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWS.AWSError>> {
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

    return TestStationDAO.dbClient.batchWrite(params).promise();
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
