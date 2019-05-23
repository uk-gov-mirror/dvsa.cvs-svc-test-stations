class TestStationDAOMock {
  constructor () {
    this.testStationRecordsMock = null
    this.unprocessedItems = null
    this.numberOfRecords = null
    this.numberOfScannedRecords = null
    this.isDatabaseOn = true
  }

  getAll () {
    const responseObject = {
      Items: this.testStationRecordsMock,
      Count: this.numberOfRecords,
      ScannedCount: this.numberOfScannedRecords
    }

    if (!this.isDatabaseOn) { return Promise.reject(responseObject) }

    return Promise.resolve(responseObject)
  }

  createMultiple () {
    const responseObject = { UnprocessedItems: this.unprocessedItems }

    if (!this.isDatabaseOn) return Promise.reject(responseObject)

    return Promise.resolve(responseObject)
  }

  deleteMultiple () {
    const responseObject = { UnprocessedItems: this.unprocessedItems }

    if (!this.isDatabaseOn) return Promise.reject(responseObject)

    return Promise.resolve(responseObject)
  }

  getTestStationEmailByPNumber (testStationPNumber) {
    let responseObject = { UnprocessedItems: this.unprocessedItems }

    if (!this.isDatabaseOn) return Promise.reject(responseObject)
    if (testStationPNumber === '87-1369569') {
      responseObject = { Items: [
        'teststationname@dvsa.gov.uk',
        'teststationname1@dvsa.gov.uk',
        'teststationname2@dvsa.gov.uk'
      ] }
    } else if (testStationPNumber === '') {
      responseObject = { Count: 0 }
    }
    return Promise.resolve(responseObject)
  }
}

module.exports = TestStationDAOMock
