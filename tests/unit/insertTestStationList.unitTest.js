const TestStationService = require('../../src/services/TestStationService')
const TestStationDAOMock = require('../models/TestStationDAOMock')
const HTTPError = require('../../src/models/HTTPError')
const expect = require('chai').expect

describe('insertTestStationList', () => {
  const testStationDAOMock = new TestStationDAOMock()

  context('database call inserts items', () => {
    it('should return nothing', () => {
      testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
      const testStationService = new TestStationService(testStationDAOMock)

      return testStationService.insertTestStationList(testStationDAOMock.testStationRecordsMock)
        .then(data => {
          expect(data).to.equal(undefined)
        })
    })

    it('should return the unprocessed items', () => {
      testStationDAOMock.unprocessedItems = testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
      const testStationService = new TestStationService(testStationDAOMock)

      return testStationService.insertTestStationList(testStationDAOMock.testStationRecordsMock)
        .then(data => {
          expect(data.length).to.equal(20)
        })
    })
  })

  context('database call fails inserting items', () => {
    it('should return error 500', () => {
      testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
      testStationDAOMock.isDatabaseOn = false
      const testStationService = new TestStationService(testStationDAOMock)

      return testStationService.insertTestStationList(testStationDAOMock.testStationRecordsMock)
        .then(() => {})
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
