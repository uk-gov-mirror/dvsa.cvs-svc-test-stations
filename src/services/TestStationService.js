const HTTPError = require('../models/HTTPError')

class TestStationService {
  constructor (testStationDAO) {
    this.testStationDAO = testStationDAO
  }

  getTestStationList () {
    return this.testStationDAO.getAll()
      .then(data => {
        if (data.Count === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }

        return data.Items
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

  insertTestStationList (testStationItems) {
    return this.testStationDAO.createMultiple(testStationItems)
      .then(data => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }

  deletePreparerList (testStationItemsKeys) {
    return this.testStationDAO.deleteMultiple(testStationItemsKeys)
      .then((data) => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal ServerError')
        }
      })
  }
}

module.exports = TestStationService
