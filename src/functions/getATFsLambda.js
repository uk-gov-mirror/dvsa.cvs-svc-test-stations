const ATFService = require('../services/ATFService')
const ATFDAO = require('../models/ATFDAOmock')
const HTTPResponse = require('../models/HTTPResponse')
const path = require('path')

const getATFs = async () => {
  const DAO = new ATFDAO(path.resolve(__dirname, '../../src/mocks/mock-atf.json'))
  const service = new ATFService(DAO)

  return service.getATFList()
    .then((data) => {
      return new HTTPResponse(200, JSON.stringify(data))
    })
    .catch((error) => {
      console.log(error)

      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports = getATFs
