const LambdaTester = require('lambda-tester')
const GetTestStationsFunction = require('../../src/functions/getTestStationsLambda')
const GetTestStationsEmailFunction = require('../../src/functions/getTestStationEmails')


describe('getTestStations', () => {
  it('should return a promise', () => {
    return LambdaTester(GetTestStationsFunction)
      .expectResolve()
  })
})

describe('getTestStationsEmail', () => {
  it('should return an error', () => {
    return LambdaTester(GetTestStationsEmailFunction.getTestStationEmails)
      .expectReject()
  })
  it('should return a promise', () => {
    return LambdaTester(GetTestStationsEmailFunction.getTestStationEmails).event({
      pathParameters: {
        testStationPNumber: '87-1369569' }
    })
      .expectResolve()
  })
  it('should return a promise', () => {
    return LambdaTester(GetTestStationsEmailFunction.getTestStationEmails).event({
      pathParameters: {
        testStationPNumber: '111' }
    })
      .expectResolve()
  })
})
