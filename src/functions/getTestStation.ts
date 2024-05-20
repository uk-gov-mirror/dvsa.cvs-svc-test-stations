import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { HTTPResponse } from "../models/HTTPResponse";
import { HTTPError } from "../models/HTTPError";
import { Validator } from "../utils/Validator";
import { Handler } from "aws-lambda";
import { ERRORS, HTTPRESPONSE } from "../utils/Enum";

export const getTestStation: Handler = async (event) => {
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);

  const check: Validator = new Validator();

  if (event.pathParameters) {
    if (!check.parametersAreValid(event.pathParameters)) {
      return new HTTPResponse(400, HTTPRESPONSE.MISSING_PARAMETERS);
    }
  } else {
    return new HTTPResponse(400, HTTPRESPONSE.MISSING_PARAMETERS);
  }

  const testStationPNumber = event.pathParameters
    ? event.pathParameters.testStationPNumber
    : undefined;

  try {
    const testStation = await service.getTestStation(testStationPNumber);
    return new HTTPResponse(200, testStation);
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof HTTPError)) {
      error.statusCode = 500;
      error.body = ERRORS.INTERNAL_SERVER_ERROR;
    }
    return new HTTPError(error.statusCode, error.body);
  }
};
