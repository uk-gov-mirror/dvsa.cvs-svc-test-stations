const TestStationService = require('../../src/services/TestStationService')
const TestStationDAOMock = require('../models/TestStationDAOMock')
const HTTPError = require('../../src/models/HTTPError')
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')

describe('deleteTestStationsList', () => {
  const testStationDAOMock = new TestStationDAOMock()

  context('database call deletes items', () => {
    it('should return nothing', () => {
      testStationDAOMock.testStationRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-stations.json'), 'utf8'))
      const testStationService = new TestStationService(testStationDAOMock)

      return testStationService.deleteTestStationsList(testStationDAOMock.testStationRecordsMock)
        .then(data => {
          expect(data).to.be.undefined
        })
    })

    it('should return the unprocessed items', () => {
      testStationDAOMock.unprocessedItems = testStationDAOMock.testStationRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-stations.json'), 'utf8'))
      const testStationService = new TestStationService(testStationDAOMock)

      return testStationService.deleteTestStationsList(testStationDAOMock.testStationRecordsMock)
        .then(data => {
          expect(data.length).to.equal(20)
        })
    })
  })

  context('database call fails deleting items', () => {
    it('should return error 500', () => {
      testStationDAOMock.testStationRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-stations.json'), 'utf8'))
      testStationDAOMock.isDatabaseOn = false
      const testStationService = new TestStationService(testStationDAOMock)

      return testStationService.deleteTestStationsList(testStationDAOMock.testStationRecordsMock)
        .then(() => {})
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
