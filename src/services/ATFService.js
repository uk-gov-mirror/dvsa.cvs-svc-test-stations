const HTTPStatusResponse = require('../models/HTTPStatusResponse')
const HTTPErrorResponse = require('../models/HTTPStatusResponse')

class ATFService {
  constructor (atfDAO) {
    this.atfDAO = atfDAO
  }

  getATFList () {
    return this.atfDAO.getAll()
      .then(data => {
        if (data.length === 0) {
          throw new HTTPErrorResponse(404, 'No resources match the search criteria.')
        }

        return new HTTPStatusResponse(200, data)
      })
      .catch(error => {
        console.log(error)

        if (!error.statusCode) {
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPErrorResponse(error.statusCode, error.body)
      })
  }
}

module.exports = ATFService
