const TestStationService = require('../services/TestStationService')
const TestStationDAO = require('../models/TestStationDAO')
const HTTPResponse = require('../models/HTTPResponse')

const getTestStationEmails = async (event) => {
  const testStationDAO = new TestStationDAO()
  const service = new TestStationService(testStationDAO)
  const testStationPNumber = event.pathParameters.testStationPNumber

  return service.getTestStationEmails(testStationPNumber)
    .then((data) => {
      return new HTTPResponse(200, data)
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports.getTestStationEmails = getTestStationEmails
