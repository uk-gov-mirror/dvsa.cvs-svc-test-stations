import * as fs from "fs";
import * as path from "path";
import {TestStationDAO} from "../../src/models/TestStationDAO";
import {ITestStation} from "../../src/models/ITestStation";
import { TestStationService } from "../../src/services/TestStationService";

export const populateDatabase =  () => {
    const testStationMockDB = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));
    const testStationService = new TestStationService(new TestStationDAO());
    testStationService.insertTestStationList(testStationMockDB);
};

export const emptyDatabase = () => {
    const testStationDAO = new TestStationDAO();
    const dataBuffer = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));

    const batches = [];
    while (dataBuffer.length > 0) {
        batches.push(dataBuffer.splice(0, 25));
    }
    return batches.forEach((batch) => {
        return testStationDAO.deleteMultiple(
          batch.map((item: any) => {
              return item.testStationId;
          })
        );
    });
};
