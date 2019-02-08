const HTTPError = require('../models/HTTPError')

class TestStationService {
  constructor (testStationDAO) {
    this.testStationDAO = testStationDAO
  }

  getTestStationList () {
    return this.testStationDAO.getAll()
      .then(data => {
        if (data.length === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }

        return data
      })
      .catch(error => {
        if (!(error instanceof HTTPError)) {
          console.log(error)
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPError(error.statusCode, error.body)
      })
  }
}

module.exports = TestStationService
