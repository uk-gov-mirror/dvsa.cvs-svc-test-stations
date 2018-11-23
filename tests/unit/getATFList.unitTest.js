/* global describe it context */
const expect = require('chai').expect
const ATFService = require('../../src/services/ATFService')
const ATFDAO = require('../../src/models/ATFDAOmock')
const HTTPResponseStatus = require('../../src/models/HTTPResponseStatus')
const path = require('path')

describe('ATFDAO', () => {
  context('when it is instantiated with a correct data source', () => {
    it('returns source contents', () => {
      const DAO = new ATFDAO(path.resolve(__dirname, '../../src/mocks/mock-atf.json'))

      DAO.getAll()
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
      const DAO = new ATFDAO(path.resolve(__dirname, '../..'))

      DAO.getAll()
        .catch((errorResponse) => {
          expect(errorResponse).to.be.an.instanceOf(HTTPResponseStatus)
        })
    })
  })
})

describe('ATFService', () => {
  context('when it is instantiated with a working DAO', () => {
    it('returns ATF data', () => {
      const DAO = new ATFDAO(path.resolve(__dirname, '../../src/mocks/mock-atf.json'))
      const service = new ATFService(DAO)

      service.getATFList()
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
      const DAO = new ATFDAO(path.resolve(__dirname, '../..'))
      const service = new ATFService(DAO)

      service.getATFList()
        .catch((errorResponse) => {
          expect(errorResponse).to.be.an.instanceOf(HTTPResponseStatus)
        })
    })
  })
})
