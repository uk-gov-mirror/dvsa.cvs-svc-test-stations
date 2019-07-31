import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { HTTPResponse } from "../models/HTTPResponse";
import {Handler} from "aws-lambda";
import {HTTPError} from "../models/HTTPError";

export const getTestStationsEmails: Handler = (event) => {
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);
  const testStationPNumber = event.pathParameters ? event.pathParameters.testStationPNumber : undefined;

  return service.getTestStationEmails(testStationPNumber)
      .then((data) => {
        return new HTTPResponse(200, data);
      })
      .catch((error: any) => {
        return new HTTPError(error.statusCode, error.body);
      });
};
