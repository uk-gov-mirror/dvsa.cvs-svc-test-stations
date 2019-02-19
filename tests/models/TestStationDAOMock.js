class TestStationDAOMock {
  constructor () {
    this.testStationRecordsMock = null
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
}

module.exports = TestStationDAOMock
