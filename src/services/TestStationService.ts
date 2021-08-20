import { HTTPError } from "../models/HTTPError";
import { TestStationDAO } from "../models/TestStationDAO";
import { ITestStation } from "../models/ITestStation";
import { ERRORS, TEST_STATION_STATUS } from "../utils/Enum";

export class TestStationService {
  public readonly testStationDAO: TestStationDAO;

  constructor(testStationDAO: TestStationDAO) {
    this.testStationDAO = testStationDAO;
  }

  /**
   * Fetch a list of all test stations (ATFs) from DynamoDB
   */
  public getTestStationList() {
    return this.testStationDAO
      .getAll(TEST_STATION_STATUS.ACTIVE)
      .then((data: any) => {
        if (data.Count === 0) {
          throw new HTTPError(404, ERRORS.RESOURCE_NOT_FOUND);
        }
        return data.Items;
      })
      .catch((error: any) => {
        if (!(error instanceof HTTPError)) {
          console.log(error);
          error.statusCode = 500;
          error.body = ERRORS.INTERNAL_SERVER_ERROR;
        }
        throw new HTTPError(error.statusCode, error.body);
      });
  }

  public getTestStationEmails = (pNumber: string) => {
    return this.testStationDAO
      .getTestStationEmailByPNumber(pNumber)
      .then((data: any) => {
        if (data.Count === 0) {
          throw new HTTPError(404, ERRORS.RESOURCE_NOT_FOUND);
        }

        return data.Items;
      })
      .catch((error: any) => {
        if (!(error instanceof HTTPError)) {
          console.log(error);
          error.statusCode = 500;
          error.body = ERRORS.INTERNAL_SERVER_ERROR;
        }
        throw new HTTPError(error.statusCode, error.body);
      });
  };

  /**
   * Add the provided Test Stations (ATFs) details to the DB. Currently unused.
   * @param testStationItems (TestStation array)
   */
  public insertTestStation(testStationItem: ITestStation) {
    return this.testStationDAO
      .createItem(testStationItem)
      .then((data: any) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error: any) => {
        if (error) {
          console.error(error);
        }
        throw new HTTPError(500, ERRORS.INTERNAL_SERVER_ERROR);
      });
  }

  /**
   * Add the provided Test Stations (ATFs) details to the DB. Currently unused.
   * @param testStationItem: new body of the test station
   * @param id: the id of the test station being updated
   */
  public updateTestStation(testStationItem: ITestStation, id: string) {
    const transactExpression = {
      ConditionExpression: "testStationId = :testStationId",
      ExpressionAttributeValues: {
        ":testStationId": id,
      },
    };
    return this.testStationDAO
      .transactWrite(testStationItem, transactExpression)
      .then((data: any) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error: any) => {
        if (error) {
          console.error(error);
        }
        throw new HTTPError(500, error);
      });
  }

  /**
   * Remove specified Test Stations from the DB
   * @param testStationItemsKeys
   */
  public deleteTestStationsList(testStationItemsKeys: string[]) {
    return this.testStationDAO
      .deleteMultiple(testStationItemsKeys)
      .then((data: any) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error: any) => {
        if (error) {
          console.error(error);
        }
        throw new HTTPError(500, ERRORS.INTERNAL_SERVER_ERROR);
      });
  }
}
