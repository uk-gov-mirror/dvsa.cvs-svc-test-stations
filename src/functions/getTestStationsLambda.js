const TestStationService = require('../services/TestStationService')
const TestStationDAO = require('../models/TestStationDAO')
const HTTPResponse = require('../models/HTTPResponse')
const AWSXRay = require('aws-xray-sdk')

const getTestStations = async () => {
  const testStationDAO = new TestStationDAO()
  const service = new TestStationService(testStationDAO)

  return AWSXRay.captureAsyncFunc('getTestStations', () => {
    service.getTestStationList()
      .then((data) => {
        return new HTTPResponse(200, data)
      })
      .catch((error) => {
        return new HTTPResponse(error.statusCode, error.body)
      })
      .then(() => {
        AWSXRay.getSegment().close()
      })
  })
}

module.exports = getTestStations
