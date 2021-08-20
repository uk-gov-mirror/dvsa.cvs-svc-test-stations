import { TestStationDAO } from "../../src/models/TestStationDAO";
import testStations from "../resources/test-stations.json";
import * as _ from "lodash";

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
  const mockBuffer = _.cloneDeep(testStations).map(
    (station) => station.testStationId
  );
  const batches = [];
  while (mockBuffer.length > 0) {
    batches.push(mockBuffer.splice(0, 25));
  }
  for (const batch of batches) {
    await testStationDAO.deleteMultiple(batch);
  }
};
