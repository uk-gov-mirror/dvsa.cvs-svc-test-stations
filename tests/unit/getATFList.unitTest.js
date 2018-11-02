/* global describe it */
const expect = require('expect')
const getATFList = require('../../services/getATFListService')

describe('getATFList', () => {
  it('should return a populated list of atfs', () => {
    getATFList().then((ATFs) => {
      expect(ATFs.length).toBeGreaterThan(0)
    })
  })
})
