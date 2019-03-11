/* global describe context it before beforeEach after afterEach */

const supertest = require('supertest')
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const url = 'http://localhost:3004/'
const request = supertest(url)
const TestStationService = require('../../src/services/TestStationService')
const TestStationDAO = require('../../src/models/TestStationDAO')

describe('test stations', () => {
  describe('getTestStation', () => {
    context('when database is populated', () => {
      let testStationService = null
      const testStationData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-stations.json'), 'utf8'))
      let testStationDAO = null

      before((done) => {
        testStationDAO = new TestStationDAO()
        testStationService = new TestStationService(testStationDAO)
        let mockBuffer = testStationData.slice()

        let batches = []
        while (mockBuffer.length > 0) {
          batches.push(mockBuffer.splice(0, 25))
        }

        batches.forEach((batch) => {
          testStationService.insertTestStationList(batch)
        })

        done()
      })

      it('should return all test stations in the database', (done) => {
        let expectedResponse = JSON.parse(JSON.stringify(testStationData))

        request.get('test-stations')
          .end((err, res) => {
            console.log()
            if (err) { expect.fail(err) }
            expect(res.statusCode).to.equal(200)
            expect(res.headers['access-control-allow-origin']).to.equal('*')
            expect(res.headers['access-control-allow-credentials']).to.equal('true')
            expect(res.body.length).to.equal(expectedResponse.length)
            done()
          })
      })

      after((done) => {
        let dataBuffer = testStationData

        let batches = []
        while (dataBuffer.length > 0) {
          batches.push(dataBuffer.splice(0, 25))
        }

        batches.forEach((batch) => {
          testStationService.deleteTestStationsList(
            batch.map((item) => {
              return item.testStationId
            })
          )
        })

        done()
      })
    })
  })

  context('when database is empty', () => {
    it('should return error code 404', (done) => {
      request.get('preparers').expect(404, done)
    })
  })

  beforeEach((done) => {
    setTimeout(done, 500)
  })
  afterEach((done) => {
    setTimeout(done, 500)
  })
})
