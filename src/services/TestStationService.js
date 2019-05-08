const HTTPError = require('../models/HTTPError')
const AWSXRay = require('aws-xray-sdk-core')

AWSXRay.enableManualMode()

class TestStationService {
  constructor (testStationDAO) {
    this.testStationDAO = testStationDAO
  }

  getTestStationList () {
    const retrievedSegment = AWSXRay.getSegment();

    console.log('TEST SEGMENT QWERTY',retrievedSegment)
    const segment = new AWSXRay.Segment('hello')
    segment.addAnnotation('retrieved segment', retrievedSegment)

    return this.testStationDAO.getAll()
      .then(data => {
        segment.addAnnotation("stations", data)
        if (data.Count === 0) {
          // segment.addError()
          throw new HTTPError(404, 'No resources match the search criteria.')
        }
        segment.close();
        return data.Items
      })
      .catch(error => {
        segment.addError(error);
        if (!(error instanceof HTTPError)) {
          console.log('thrown error', error, 'END of error')
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }
        segment.close();
        throw new HTTPError(error.statusCode, error.body)
      })
  }

  insertTestStationList (testStationItems) {
    return this.testStationDAO.createMultiple(testStationItems)
      .then(data => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }

  deleteTestStationsList (testStationItemsKeys) {
    return this.testStationDAO.deleteMultiple(testStationItemsKeys)
      .then((data) => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }
}

module.exports = TestStationService
