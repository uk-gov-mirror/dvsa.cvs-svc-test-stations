import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { HTTPResponse } from "../models/HTTPResponse";
import { HTTPError } from "../models/HTTPError";
import { Validator } from "../utils/Validator";
import { HTTPRESPONSE } from "../utils/Enum";
import { Handler } from "aws-lambda";

export const getTestStationsEmails: Handler = (event) => {
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);
  const check: Validator = new Validator();

  if (event.pathParameters) {
    if (!check.parametersAreValid(event.pathParameters)) {
      return Promise.resolve(
        new HTTPResponse(400, HTTPRESPONSE.MISSING_PARAMETERS)
      );
    }
  } else {
    return Promise.resolve(
      new HTTPResponse(400, HTTPRESPONSE.MISSING_PARAMETERS)
    );
  }

  const testStationPNumber = event.pathParameters
    ? event.pathParameters.testStationPNumber
    : undefined;

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
