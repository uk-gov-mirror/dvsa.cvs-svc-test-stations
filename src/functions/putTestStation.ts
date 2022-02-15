import Joi from "joi";
import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";

export const putTestStation = async (testStation: any) => {
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
    testStationLongitude: Joi.number().allow(null),
    testStationLatitude: Joi.number().allow(null),
    testStationType: Joi.any()
      .required()
      .valid("atf", "tass", "gvts", "potf", "other"),
    testStationEmails: Joi.array().items(Joi.string()).required(),
  });
  await schema.validateAsync(testStation);
}
