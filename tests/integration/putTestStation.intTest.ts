import stations from "../resources/test-stations.json";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
import { ITestStation } from "../../src/models/ITestStation";
import LambdaTester from "lambda-tester";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";
import { HTTPError } from "../../src/models/HTTPError";

let testStation: ITestStation;

jest.setTimeout(50000); // eventual consistency can take time
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const injection = async (detail: ITestStation) => {
  try {
    const eventBridge = new EventBridgeClient({
      endpoint: "http://127.0.0.1:4010",
      region: "eu-west-1",
    });

    const command = new PutEventsCommand({
      Entries: [
        {
          Source: "cvs.update.test.stations",
          Detail: JSON.stringify(detail),
        },
      ],
    });
    const response = await eventBridge.send(command);

    await sleep(2000);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

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

      await LambdaTester(getTestStationsEmails)
        .event({
          pathParameters: {
            testStationPNumber: "87-1369569",
          },
        })
        .expectResolve((result: any) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toStrictEqual(originalResponse);
        });

      testStation.testStationEmails.push("teststationname3@dvsa.gov.uk");
      testStation.testStationId = "12345";

      await injection(testStation);

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

      await LambdaTester(getTestStationsEmails)
        .event({
          pathParameters: {
            testStationPNumber: "87-1369569",
          },
        })
        .expectResolve((result: any) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toStrictEqual(updatedResponse);
        });

      return;
    });
  });

  context("when inserting a record", () => {
    it("get should return the inserted record", async () => {
      testStation.testStationId = "123-456-789";
      testStation.testStationPNumber = "84-123456";

      await LambdaTester(getTestStationsEmails)
        .event({
          pathParameters: {
            testStationPNumber: "84-123456",
          },
        })
        .expectReject((error: Error) => {
          expect(error).toBeTruthy();
          expect(error).toBeInstanceOf(HTTPError);
          expect((error as HTTPError).statusCode).toEqual(404);
        });

      await injection(testStation);

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

      await LambdaTester(getTestStationsEmails)
        .event({
          pathParameters: {
            testStationPNumber: "84-123456",
          },
        })
        .expectResolve((result: any) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toStrictEqual(expectedResponse);
        });
    });
  });
});
