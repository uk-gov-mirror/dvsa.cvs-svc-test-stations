import { Configuration } from "../utils/Configuration";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { ITestStation } from "./ITestStation";
import { PromiseResult } from "aws-sdk/lib/request";
import { default as unwrappedAWS } from "aws-sdk";
import {TEST_STATION_STATUS} from "../utils/Enum";

/* tslint:disable */
const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(unwrappedAWS)
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
        "#testStationPNumber": "testStationPNumber"
      },
      ExpressionAttributeValues: {
        ":testStationPNumber": testStationPNumber
      }
    };

    return TestStationDAO.dbClient.query(params).promise();
  }

  /**
   * Get All test stations in the DB, filtered by status
   * If the statusFilter is set to null, get all test stations
   * @returns ultimately, an array of TestStation objects, wrapped in a PromiseResult, wrapped in a Promise
   */
  public getAll(statusFilter: TEST_STATION_STATUS | null): Promise<PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>> {
    let scanParams = { TableName: this.tableName };
    if (statusFilter) {
      const filter = {
        FilterExpression: "#testStationStatus = :testStationStatus",
        ExpressionAttributeNames: {
          "#testStationStatus": "testStationStatus",
        },
        ExpressionAttributeValues: {
          ":testStationStatus": statusFilter,
        }
      };
      scanParams = {...scanParams, ...filter};
    }
    return TestStationDAO.dbClient.scan(scanParams).promise();
  }

  /**
   * Write data about multiple Test Stations to the DB.
   * @param testStationItems: ITestStation[]
   * @returns DynamoDB BatchWriteItemOutput, wrapped in promises
   */
  public createMultiple(testStationItems: ITestStation[]): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWS.AWSError>> {
    const params = this.generatePartialParams();

    testStationItems.map((testStationItem: ITestStation) => {
    params.RequestItems[this.tableName].push(
      {
        PutRequest: {
          Item: testStationItem
        }
      }
    );
  });

    return TestStationDAO.dbClient.batchWrite(params).promise();
  }

  /**
   * Removes multiple Test Stations from the DB
   * @param primaryKeysToBeDeleted
   */
  public deleteMultiple(primaryKeysToBeDeleted: string[]): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWS.AWSError>> {
    const params = this.generatePartialParams();

    primaryKeysToBeDeleted.forEach((key: string) => {
    params.RequestItems[this.tableName].push(
      {
        DeleteRequest:
          {
            Key:
              {
                testStationId: key
              }
          }
      }
    );
  });

    return TestStationDAO.dbClient.batchWrite(params).promise();
  }

  /**
   * Internal method for getting a common parameter template
   */
  private generatePartialParams(): any {
    return {
      RequestItems:
        {
          [this.tableName]: Array()
        }
    };
  }
}
