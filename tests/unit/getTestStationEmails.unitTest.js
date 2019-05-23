/* global describe it context */
const TestStationService = require('../../src/services/TestStationService')
const TestStationDAOMock = require('../models/TestStationDAOMock')
const HTTPError = require('../../src/models/HTTPError')
const expect = require('chai').expect

describe('getTestStationEmail', () => {
  var testStationDAOMock = new TestStationDAOMock()

  describe('when database is on', () => {
    context('database call returns valid data', () => {
      it('should return the expected data', () => {
        testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
        testStationDAOMock.numberOfRecords = 20
        testStationDAOMock.numberOfScannedRecords = 20
        const testStationService = new TestStationService(testStationDAOMock)

        return testStationService.getTestStationEmails('87-1369569')
          .then((returnedRecords) => {
            expect(returnedRecords.length).to.equal(3)
          })
      })
    })
    context('database call returns no data', () => {
      it('should throw error', () => {
        testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
        testStationDAOMock.numberOfRecords = 0
        testStationDAOMock.numberOfScannedRecords = 0
        const testStationService = new TestStationService(testStationDAOMock)

        return testStationService.getTestStationEmails('')
          .then(() => {
          }).catch((errorResponse) => {
            expect(errorResponse).to.be.instanceOf(HTTPError)
            expect(errorResponse.statusCode).to.be.equal(404)
            expect(errorResponse.body).to.equal('No resources match the search criteria.')
          })
      })
    })
  })
})
