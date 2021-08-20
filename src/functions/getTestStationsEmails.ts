import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { HTTPResponse } from "../models/HTTPResponse";
import { Handler } from "aws-lambda";
import { HTTPError } from "../models/HTTPError";

export const getTestStationsEmails: Handler = (event) => {
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);
  const testStationPNumber = event.pathParameters
    ? event.pathParameters.testStationPNumber
    : undefined;

  if (!event.pathParameters || !event.pathParameters.testStationPNumber) {
    return Promise.reject(
      new HTTPError(400, "Request missing Station P Number")
    );
  }

  return service
    .getTestStationEmails(testStationPNumber)
    .then((data) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      console.error(error);
      throw new HTTPError(error.statusCode, error.body);
    });
};
