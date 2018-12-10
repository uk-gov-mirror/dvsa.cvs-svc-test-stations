const HTTPError = require('../models/HTTPError')

class ATFService {
  constructor (atfDAO) {
    this.atfDAO = atfDAO
  }

  getATFList () {
    return this.atfDAO.getAll()
      .then(data => {
        if (data.length === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }

        return data
      })
      .catch(error => {
        console.log(error)

        if (!error.statusCode) {
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPError(error.statusCode, error.body)
      })
  }
}

module.exports = ATFService
