const getATFList = require('../services/getATFListService')

const getATFs = async () => {
  return getATFList()
    .then((ATFs) => {
      return {
        statusCode: 200,
        body: JSON.stringify(ATFs)
      }
    })
    .catch((error) => {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify(error.body)
      }
    })
}

module.exports = getATFs
