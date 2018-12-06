const ATFService = require('../services/ATFService')
const ATFDAO = require('../models/ATFDAOmock')
const path = require('path')

const getATFs = async () => {
  const DAO = new ATFDAO(path.resolve(__dirname, '../../src/mocks/mock-atf.json'))
  const service = new ATFService(DAO)

  return service.getATFList()
    .then((ATFs) => {
      return {
        statusCode: 200,
        body: JSON.stringify(ATFs)
      }
    })
    .catch((error) => {
      console.log(error)

      return {
        statusCode: error.statusCode,
        body: JSON.stringify(error.body)
      }
    })
}

module.exports = getATFs
