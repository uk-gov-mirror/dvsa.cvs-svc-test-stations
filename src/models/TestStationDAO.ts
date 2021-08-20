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
  public getAll(
    statusFilter: TEST_STATION_STATUS | null
  ): Promise<PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>> {
    let scanParams = { TableName: this.tableName };
    if (statusFilter) {
      const filter = {
        FilterExpression: "#testStationStatus = :testStationStatus",
        ExpressionAttributeNames: {
          "#testStationStatus": "testStationStatus",
        },
        ExpressionAttributeValues: {
          ":testStationStatus": statusFilter,
        },
      };
      scanParams = { ...scanParams, ...filter };
    }
    return TestStationDAO.dbClient.scan(scanParams).promise();
  }

  /**
   * Write data about multiple Test Stations to the DB.
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
   * Write data about multiple Test Stations to the DB.
   * @param testStationItem: ITestStation[]
   * @returns DynamoDB BatchWriteItemOutput, wrapped in promises
   */
  public createItem(
    testStationItem: ITestStation
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWS.AWSError>> {
    const params = {
      TableName: this.tableName,
      Item: testStationItem,
      ConditionExpression: "attribute_not_exists(testStationId)",
    };
    return TestStationDAO.dbClient.put(params).promise();
  }

  /**
   * Removes multiple Test Stations from the DB
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
   * Performs a write transaction on the specified table.
   * @param item - the item to be inserted or updated during the transaciton.
   * @param oldItem - the current item that already exists in the database.
   */
  public transactWrite(
    item: any,
    transactExpression: {
      ConditionExpression: string;
      ExpressionAttributeValues: any;
    }
  ): Promise<
    PromiseResult<DocumentClient.TransactWriteItemsOutput, AWS.AWSError>
  > {
    const query: DocumentClient.TransactWriteItemsInput = {
      TransactItems: [
        {
          Put: {
            TableName: this.tableName,
            Item: item,
            ConditionExpression: transactExpression.ConditionExpression,
            ExpressionAttributeValues:
              transactExpression.ExpressionAttributeValues,
          },
        },
      ],
    };
    return TestStationDAO.dbClient.transactWrite(query).promise();
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
