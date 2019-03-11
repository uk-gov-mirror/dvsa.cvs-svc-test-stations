const LambdaTester = require('lambda-tester')
const GetTestStationsFunction = require('../../src/functions/getTestStationsLambda')

describe('getTestStations', () => {
  it('should return a promise', () => {
    return LambdaTester(GetTestStationsFunction)
      .expectResolve()
  })
})
