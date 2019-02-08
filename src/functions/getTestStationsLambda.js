const TestStationService = require('../services/TestStationService')
const TestStationDAO = require('../models/TestStationDAOmock')
const HTTPResponse = require('../models/HTTPResponse')

const getTestStations = async () => {
  const mockData = require('../mocks/mock-testStation.json')
  const DAO = new TestStationDAO(mockData)

  const service = new TestStationService(DAO)

  return service.getTestStationList()
    .then((data) => {
      return new HTTPResponse(200, data)
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports = getTestStations
