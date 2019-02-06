/* global describe it context */
const supertest = require('supertest')
const expect = require('expect')

const url = `http://localhost:3004/`
const request = supertest(url)

describe('testStations', () => {
  context('GET', () => {
    context('all testStations', () => {
      it('should return all testStations', (done) => {
        request
          .get('test-stations')
          .set('Context-Type', 'application/json')
          .set('authorization', 'allow')
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect('access-control-allow-origin', '*')
          .expect('access-control-allow-credentials', 'true')
          .end((err, res) => {
            if (err) throw err
            expect(res.body.length).toBeGreaterThan(0)
            done()
          })
      })
    })
  })
})
