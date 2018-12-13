const ATFService = require('../services/ATFService')
const ATFDAO = require('../models/ATFDAOmock')
const HTTPResponse = require('../models/HTTPResponse')

const getATFs = async () => {
  const mockData = require('../mocks/mock-atf.json')
  const DAO = new ATFDAO(mockData)
  const service = new ATFService(DAO)

  return service.getATFList()
    .then((data) => {
      return new HTTPResponse(200, data)
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports = getATFs
