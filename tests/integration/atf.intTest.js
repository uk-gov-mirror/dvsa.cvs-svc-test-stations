/* global describe it context */
const supertest = require('supertest')
const expect = require('expect')

const url = `http://localhost:${process.env.SERVERLESS_PORT}/`
const request = supertest(url)

describe('atfs', () => {
  context('GET', () => {
    context('all atfs', () => {
      it('should return all atfs', (done) => {
        request
          .get('atf')
          .set('Context-Type', 'application/json')
          .set('authorization', 'allow')
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end((err, res) => {
            if (err) throw err
            expect(res.body.length).toBeGreaterThan(0)
            done()
          })
      })
    })
  })
})
