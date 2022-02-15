import stations from "../resources/test-stations.json";
import supertest from "supertest";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
import { ITestStation } from "../../src/models/ITestStation";
const url = "http://localhost:3004/";
const request = supertest(url);
let testStation: ITestStation;

describe("getTestStation", () => {
  beforeAll(async () => {
    await emptyDatabase();
  });

  beforeEach(async () => {
    testStation = JSON.parse(JSON.stringify(stations[0]));
    await populateDatabase();
  });

  afterEach(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  context("when updating a record", () => {
    it("get should return the updated record", async () => {
      const originalResponse = [
        {
          testStationPNumber: "87-1369569",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
            "teststationname2@dvsa.gov.uk",
          ],
          testStationId: "1",
        },
      ];

      const originalRes = await request.get("test-stations/87-1369569");
      expect(originalRes.status).toEqual(200);
      expect(originalRes.body).toStrictEqual(originalResponse);

      testStation.testStationEmails.push("teststationname3@dvsa.gov.uk");
      const testStationUpdateEvent = {
        version: "0",
        id: "3b8d813d-9e1c-0c30-72f9-7539de987e31",
        source: "cvs.update.test.stations",
        account: "1234567",
        time: "2000-01-01T00:00:00Z",
        region: "eu-west-1",
        resources: [],
        detail: testStation,
      };

      await request
        .post(
          "{apiVersion}/functions/cvs-svc-test-station-dev-getTestStations/invocations"
        )
        .send(testStationUpdateEvent);

      const updatedResponse = [
        {
          testStationPNumber: "87-1369569",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
            "teststationname2@dvsa.gov.uk",
            "teststationname3@dvsa.gov.uk",
          ],
          testStationId: "1",
        },
      ];

      const res = await request.get("test-stations/87-1369569");
      expect(res.status).toEqual(200);
      expect(res.body).toStrictEqual(updatedResponse);

      return;
    });
  });

  context("when inserting a record", () => {
    it("get should return the inserted record", async () => {
      testStation.testStationId = "123-456-789";
      testStation.testStationPNumber = "84-123456";

      const originalRes = await request.get("test-stations/84-123456");
      expect(originalRes.status).toEqual(200);
      expect(originalRes.body).toStrictEqual("");

      const testStationInsertEvent = {
        version: "0",
        id: "3b8d813d-9e1c-0c30-72f9-7539de987e31",
        source: "cvs.update.test.stations",
        account: "1234567",
        time: "2000-01-01T00:00:00Z",
        region: "eu-west-1",
        resources: [],
        detail: testStation,
      };

      await request
        .post(
          "{apiVersion}/functions/cvs-svc-test-station-dev-getTestStations/invocations"
        )
        .send(testStationInsertEvent);

      const expectedResponse = [
        {
          testStationPNumber: "84-123456",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
            "teststationname2@dvsa.gov.uk",
          ],
          testStationId: "123-456-789",
        },
      ];

      const res = await request.get("test-stations/84-123456");
      expect(res.status).toEqual(200);
      expect(res.body).toStrictEqual(expectedResponse);
    });
  });
});
