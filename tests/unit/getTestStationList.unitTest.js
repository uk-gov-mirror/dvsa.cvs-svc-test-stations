/* global describe it context */
const TestStationService = require('../../src/services/TestStationService')
const TestStationDAOMock = require('../models/TestStationDAOMock')
const HTTPError = require('../../src/models/HTTPError')
const expect = require('chai').expect

describe('getTestStationList', () => {
  var testStationDAOMock = new TestStationDAOMock()

  describe('when database is on', () => {
    context('database call returns valid data', () => {
      it('should return the expected data', () => {
        testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
        testStationDAOMock.numberOfRecords = 20
        testStationDAOMock.numberOfScannedRecords = 20
        const testStationService = new TestStationService(testStationDAOMock)

        return testStationService.getTestStationList()
          .then((returnedRecords) => {
            // console.log("*** ",returnedRecords.length);
            expect(returnedRecords.Items.length).to.equal(20)
          })
      })
    })
    context('database call returns empty data', () => {
      it('should return error 404', () => {
        testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
        testStationDAOMock.numberOfRecords = 0
        testStationDAOMock.numberOfScannedRecords = 0
        const testStationService = new TestStationService(testStationDAOMock)

        return testStationService.getTestStationList()
          .then(() => {
            expect.fail()
          }).catch((errorResponse) => {
            expect(errorResponse).to.be.instanceOf(HTTPError)
            expect(errorResponse.statusCode).to.equal(404)
            expect(errorResponse.body).to.equal('No resources match the search criteria.')
          })
      })
    })
  })

  describe('when database is off', () => {
    it('should return error 500', () => {
      testStationDAOMock.testStationRecordsMock = require('../resources/test-stations.json')
      testStationDAOMock.numberOfRecords = 20
      testStationDAOMock.numberOfScannedRecords = 20
      testStationDAOMock.isDatabaseOn = false
      const testStationService = new TestStationService(testStationDAOMock)

      return testStationService.getTestStationList()
        .then(() => {})
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
