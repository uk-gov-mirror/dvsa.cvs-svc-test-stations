export class TestStationDAOMock {
  public static testStationRecordsMock: any;
  public static unprocessedItems: any;
  public static numberOfRecords: number | null;
  public static numberOfScannedRecords: number | null;
  public static isDatabaseOn: boolean;

  constructor() {
    TestStationDAOMock.testStationRecordsMock = null;
    TestStationDAOMock.unprocessedItems = null;
    TestStationDAOMock.numberOfRecords = null;
    TestStationDAOMock.numberOfScannedRecords = null;
    TestStationDAOMock.isDatabaseOn = true;
  }
  /**
   * Get All
   * @returns a Promise containing some mock TestStation objects
   */
  public getAll() {
    const responseObject = {
      Items: TestStationDAOMock.testStationRecordsMock,
      Count: TestStationDAOMock.numberOfRecords,
      ScannedCount: TestStationDAOMock.numberOfScannedRecords
    };

    if (!TestStationDAOMock.isDatabaseOn) { return Promise.reject(responseObject); }

    return Promise.resolve(responseObject);
  }

  /**
   * createMultiple
   * @returns a promise containing a pre-specified list of "unprocessed" entities
   */
  public createMultiple() {
    const responseObject = { UnprocessedItems: TestStationDAOMock.unprocessedItems };

    if (!TestStationDAOMock.isDatabaseOn) { return Promise.reject(responseObject); }

    return Promise.resolve(responseObject);
  }

  /**
   * delete Multiple
   * @returns a promise containing a pre-specified list of "unprocessed" entities
   */
  public deleteMultiple() {
    const responseObject = { UnprocessedItems: TestStationDAOMock.unprocessedItems };

    if (!TestStationDAOMock.isDatabaseOn) { return Promise.reject(responseObject); }

    return Promise.resolve(responseObject);
  }

  /**
   * text
   * @param testStationPNumber
   * @returns a promise containing a pre-specified array of station emails
   */
  public getTestStationEmailByPNumber(testStationPNumber: string) {
    let responseObject: any = { UnprocessedItems: TestStationDAOMock.unprocessedItems };

    if (!TestStationDAOMock.isDatabaseOn) { return Promise.reject(responseObject); }
    if (testStationPNumber === "87-1369569") {
      responseObject = { Items: [
        "teststationname@dvsa.gov.uk",
        "teststationname1@dvsa.gov.uk",
        "teststationname2@dvsa.gov.uk"
      ] };
    } else if (testStationPNumber === "") {
      responseObject = { Count: 0 };
    }
    return Promise.resolve(responseObject);
  }
}
