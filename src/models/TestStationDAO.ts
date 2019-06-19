import { Configuration } from "../utils/Configuration";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { ITestStation } from "./ITestStation";
import { PromiseResult } from "aws-sdk/lib/request";
import { default as unwrappedAWS } from 'aws-sdk'

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
   * Get All test stations in the DB
   * @returns ultimately, an array of TestStation objects, wrapped in a PromiseResult, wrapped in a Promise
   */
  public getAll(): Promise<PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>> {
    return TestStationDAO.dbClient.scan({ TableName: this.tableName }).promise();
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
