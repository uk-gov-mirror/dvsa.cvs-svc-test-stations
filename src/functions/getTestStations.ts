import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { HTTPResponse } from "../models/HTTPResponse";
import { ITestStation } from "../models/ITestStation";
import {Handler} from "aws-lambda";
import {HTTPError} from "../models/HTTPError";

export const getTestStations: Handler = async () => {
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);

  return service.getTestStationList()
      .then((data: ITestStation[]) => {
        return new HTTPResponse(200, data);
      })
      .catch((error: any) => {
        throw new HTTPError(error.statusCode, error.body);
      });
};
