import * as fs from "fs";
import * as path from "path";
import {TestStationDAO} from "../../src/models/TestStationDAO";
import {ITestStation} from "../../src/models/ITestStation";

export const populateDatabase = () => {
    const testStationDAO = new TestStationDAO();
    const mockBuffer = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));

    const batches = [];
    while (mockBuffer.length > 0) {
        batches.push(mockBuffer.splice(0, 25));
    }

    return batches.forEach(async (batch) => {
        return await testStationDAO.createMultiple(batch);
    });
};

export const emptyDatabase = () => {
    const testStationDAO = new TestStationDAO();
    const dataBuffer = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-stations.json"), "utf8"));

    const batches = [];
    while (dataBuffer.length > 0) {
        batches.push(dataBuffer.splice(0, 25));
    }
    return batches.forEach(async (batch) => {
        return await testStationDAO.deleteMultiple(
          batch.map((item: any) => {
              return item.testStationId;
          })
        );
    });
};
