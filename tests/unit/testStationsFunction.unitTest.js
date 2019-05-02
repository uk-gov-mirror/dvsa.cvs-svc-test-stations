const LambdaTester = require('lambda-tester')
const GetTestStationsFunction = require('../../src/functions/getTestStationsLambda')
const GetTestStationEmailFunction = require('../../src/functions/getTestStationEmails')

describe('getTestStations', () => {
  it('should return a promise', () => {
    return LambdaTester(GetTestStationsFunction)
      .expectResolve()
  })
})

describe('GetTestStationEmailFunction', () => {
  it('should return a promise', () => {
    return LambdaTester(GetTestStationEmailFunction)
      .expectResolve()
  })
})
