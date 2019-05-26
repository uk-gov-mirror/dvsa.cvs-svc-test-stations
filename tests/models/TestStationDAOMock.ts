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
   * Mock getAll function
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
   * Mock createMultiple function
   */
  public createMultiple() {
    const responseObject = { UnprocessedItems: TestStationDAOMock.unprocessedItems };

    if (!TestStationDAOMock.isDatabaseOn) { return Promise.reject(responseObject); }

    return Promise.resolve(responseObject);
  }

  /**
   * Mock deleteMultiple function
   */
  public deleteMultiple() {
    const responseObject = { UnprocessedItems: TestStationDAOMock.unprocessedItems };

    if (!TestStationDAOMock.isDatabaseOn) { return Promise.reject(responseObject); }

    return Promise.resolve(responseObject);
  }
}
