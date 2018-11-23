const fs = require('fs')
const HTTPResponseStatus = require('../models/HTTPResponseStatus')

class ATFDAOmock {
  constructor (mock) {
    this.mock = mock
  }

  async getAll () {
    let mockData

    try {
      mockData = JSON.parse(fs.readFileSync(this.mock, 'utf8'))
    } catch (error) {
      throw new HTTPResponseStatus(500, error.stack)
    }

    return mockData
  }
}

module.exports = ATFDAOmock
