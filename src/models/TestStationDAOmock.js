const HTTPError = require('./HTTPError')

class TestStationDAOmock {
  constructor (mock) {
    this.mock = mock
  }

  async getAll () {
    let mockData

    try {
      mockData = this.mock
    } catch (error) {
      console.log(error)

      throw new HTTPError(500, error.stack)
    }

    return mockData
  }
}

module.exports = TestStationDAOmock
