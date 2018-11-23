const HTTPResponseStatus = require('../models/HTTPResponseStatus')

class ATFService {
  constructor (atfDAO) {
    this.atfDAO = atfDAO
  }

  getATFList () {
    return this.atfDAO.getAll()
      .then(data => {
        if (data.length === 0) {
          throw new HTTPResponseStatus(404, 'No resources match the search criteria.')
        }

        return data
      })
      .catch(error => {
        if (!error.statusCode) {
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPResponseStatus(error.statusCode, error.body)
      })
  }
}

module.exports = ATFService
