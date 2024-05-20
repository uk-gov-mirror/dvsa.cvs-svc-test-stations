import { HTTPError } from "../models/HTTPError";
import { TestStationDAO } from "../models/TestStationDAO";
import { ITestStation } from "../models/ITestStation";
import { ERRORS } from "../utils/Enum";

export class TestStationService {
  public readonly testStationDAO: TestStationDAO;

  constructor(testStationDAO: TestStationDAO) {
    this.testStationDAO = testStationDAO;
  }

  /**
   * Fetch a test station (ATF) from DynamoDB based on its pNumber
   */
  public async getTestStation(pNumber: string) {
    const testStation = await this.testStationDAO.getTestStationByPNumber(
      pNumber
    );

    if (!testStation) {
      throw new HTTPError(404, ERRORS.RESOURCE_NOT_FOUND);
    }

    return testStation;
  }

  /**
   * Fetch a list of all test stations (ATFs) from DynamoDB
   */
  public getTestStationList() {
    return this.testStationDAO
      .getAll()
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

  public getTestStationEmails = async (pNumber: string) => {
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
   * Update or insert the provided Test Station details to the DB.
   * @param testStationItem (TestStation)
   */
  public async putTestStation(testStationItem: ITestStation) {
    const data: any = await this.testStationDAO.putItem(testStationItem);
    if (data?.UnprocessedItems) {
      console.error(`Item not added: ${JSON.stringify(data.UnprocessedItems)}`);
      throw new Error(ERRORS.FAILED_TO_ADD_ITEM);
    }
  }
}
