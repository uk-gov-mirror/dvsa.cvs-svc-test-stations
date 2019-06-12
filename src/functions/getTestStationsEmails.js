const TestStationService = require('../services/TestStationService')
const TestStationDAO = require('../models/TestStationDAO')
const HTTPResponse = require('../models/HTTPResponse')

const getTestStationsEmails = (event) => {
  const testStationDAO = new TestStationDAO()
  const service = new TestStationService(testStationDAO)
  const testStationPNumber = event.pathParameters ? event.pathParameters.testStationPNumber : undefined

  return service.getTestStationEmails(testStationPNumber)
    .then((data) => {
      return new HTTPResponse(200, data)
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports.getTestStationsEmails = getTestStationsEmails
