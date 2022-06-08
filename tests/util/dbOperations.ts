import * as _ from "lodash";
import testStations from "../resources/test-stations.json";
import { ITestStation } from "../../src/models/ITestStation";
import { TestStationDAO } from "../../src/models/TestStationDAO";

export const populateDatabase = async () => {
  const mockBuffer = _.cloneDeep(testStations);
  const testStationDAO = new TestStationDAO();
  const batches = [];
  while (mockBuffer.length > 0) {
    batches.push(mockBuffer.splice(0, 25));
  }
  for (const batch of batches) {
    await testStationDAO.createMultiple(batch);
  }
};

export const emptyDatabase = async () => {
  const testStationDAO = new TestStationDAO();
  let currentTestStations: ITestStation[] = [];
  await testStationDAO.getAll().then(async (data: any) => {
    currentTestStations = data.Items;
    const mockBuffer = _.cloneDeep(currentTestStations).map(
      (station) => station.testStationId
    );
    const batches = [];
    while (mockBuffer.length > 0) {
      batches.push(mockBuffer.splice(0, 25));
    }
    for (const batch of batches) {
      await testStationDAO.deleteMultiple(batch);
    }
  });
};
