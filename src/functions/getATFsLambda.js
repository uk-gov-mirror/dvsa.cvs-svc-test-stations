const ATFService = require('../services/ATFService')
const ATFDAO = require('../models/ATFDAOmock')
const path = require('path')

const getATFs = async () => {
  const DAO = new ATFDAO(path.resolve(__dirname, '../../src/mocks/mock-atf.json'))
  const service = new ATFService(DAO)

  return service.getATFList()
    .then((response) => {
      return {
        statusCode: response.statusCode,
        headers: response.headers,
        body: JSON.stringify(response.body)
      }
    })
    .catch((error) => {
      console.log(error)

      return {
        statusCode: error.statusCode,
        headers: error.headers,
        body: JSON.stringify(error.body)
      }
    })
}

module.exports = getATFs
