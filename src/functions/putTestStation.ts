import Joi from "joi";
import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { ITestStation } from "../models/ITestStation";
import { TestStationTypes } from '@dvsa/cvs-type-definitions/types/v1/enums/testStationType.enum';

export const putTestStation = async (testStation: ITestStation) => {
  await validateTestStation(testStation);
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);
  return await service.putTestStation(testStation);
};

async function validateTestStation(testStation: any) {
  const schema = Joi.object({
    testStationId: Joi.string().required(),
    testStationPNumber: Joi.string().required(),
    testStationStatus: Joi.any()
      .required()
      .valid(
        "pending",
        "active",
        "suspended",
        "termination requested",
        "terminated"
      ),
    testStationName: Joi.string().required(),
    testStationContactNumber: Joi.string().required(),
    testStationAccessNotes: Joi.string().allow(null),
    testStationGeneralNotes: Joi.string().allow(null),
    testStationTown: Joi.string().required(),
    testStationAddress: Joi.string().required(),
    testStationPostcode: Joi.string().required(),
    testStationCountry: Joi.string().allow(null),
    testStationLongitude: Joi.number().allow(null),
    testStationLatitude: Joi.number().allow(null),
    testStationType: Joi.any()
      .required()
      .valid(... Object.values(TestStationTypes)),
    testStationEmails: Joi.array().items(Joi.string()).required(),
  });
  await schema.validateAsync(testStation);
}
