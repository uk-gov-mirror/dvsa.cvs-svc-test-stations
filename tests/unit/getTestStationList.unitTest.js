/* global describe it context */
const expect = require('chai').expect
const TestStationService = require('../../src/services/TestStationService')
const TestStationDAO = require('../../src/models/TestStationDAOmock')
const HTTPError = require('../../src/models/HTTPError')
const path = require('path')

describe('TestStationDAO', () => {
  context('when it is instantiated with a correct data source', () => {
    it('returns source contents', () => {
      const mockData = require('../../src/mocks/mock-testStation.json')
      const DAO = new TestStationDAO(mockData)

      return DAO.getAll()
        .then((TestStations) => {
          expect(TestStations.length).to.equal(20)
        })
        .catch(() => {
          expect.fail()
        })
    })
  })

  context('when it is instantiated with a bad data source', () => {
    it('throws a 500 error', () => {
      const DAO = new TestStationDAO(path.resolve(__dirname, '../bad/path/file.json'))

      return DAO.getAll()
        .catch((errorResponse) => {
          expect(errorResponse).to.be.an.instanceOf(HTTPError)
        })
    })
  })
})

describe('TestStationService', () => {
  context('when it is instantiated with a working DAO', () => {
    it('returns TestStation data', () => {
      const mockData = require('../../src/mocks/mock-testStation.json')
      const DAO = new TestStationDAO(mockData)
      const service = new TestStationService(DAO)

      return service.getTestStationList()
        .then((TestStations) => {
          expect(TestStations.length).to.equal(20)
        })
        .catch(() => {
          expect.fail()
        })
    })
  })

  context('when it is instantiated with a bad DAO', () => {
    it('returns an error', () => {
      const DAO = new TestStationDAO(path.resolve(__dirname, '../bad/path/file.json'))
      const service = new TestStationService(DAO)

      return service.getTestStationList()
        .catch((errorResponse) => {
          expect(errorResponse).to.be.an.instanceOf(HTTPError)
        })
    })
  })
})
