/* global describe it context */
const expect = require('chai').expect
const ATFService = require('../../src/services/ATFService')
const ATFDAO = require('../../src/models/ATFDAOmock')
const HTTPError = require('../../src/models/HTTPError')
const path = require('path')

describe('ATFDAO', () => {
  context('when it is instantiated with a correct data source', () => {
    it('returns source contents', () => {
      const DAO = new ATFDAO(path.resolve(__dirname, '../../src/mocks/mock-atf.json'))

      return DAO.getAll()
        .then((ATFs) => {
          expect(ATFs.length).to.equal(20)
        })
        .catch(() => {
          expect.fail()
        })
    })
  })

  context('when it is instantiated with a bad data source', () => {
    it('throws a 500 error', () => {
      const DAO = new ATFDAO(path.resolve(__dirname, '../bad/path/file.json'))

      return DAO.getAll()
        .catch((errorResponse) => {
          expect(errorResponse).to.be.an.instanceOf(HTTPError)
        })
    })
  })
})

describe('ATFService', () => {
  context('when it is instantiated with a working DAO', () => {
    it('returns ATF data', () => {
      const DAO = new ATFDAO(path.resolve(__dirname, '../../src/mocks/mock-atf.json'))
      const service = new ATFService(DAO)

      return service.getATFList()
        .then((ATFs) => {
          expect(ATFs.length).to.equal(20)
        })
        .catch(() => {
          expect.fail()
        })
    })
  })

  context('when it is instantiated with a bad DAO', () => {
    it('returns an error', () => {
      const DAO = new ATFDAO(path.resolve(__dirname, '../bad/path/file.json'))
      const service = new ATFService(DAO)

      return service.getATFList()
        .catch((errorResponse) => {
          expect(errorResponse).to.be.an.instanceOf(HTTPError)
        })
    })
  })
})
