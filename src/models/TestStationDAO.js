const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const generateConfig = require('../config/generateConfig')
const config = generateConfig()
const dbClient = new AWS.DynamoDB.DocumentClient(config.DYNAMODB_DOCUMENTCLIENT_PARAMS)

class TestStationDAO {
  constructor () {
    this.tableName = config.DYNAMODB_TABLE_NAME
  }

  getAll () {
    return dbClient.scan({ TableName: this.tableName }).promise()
  }

  getTestStationEmailByPNumber (testStationPNumber) {
    let params = {
      TableName: this.tableName,
      IndexName: 'testStationPNumberIndex',
      KeyConditionExpression: '#testStationPNumber = :testStationPNumber',
      ExpressionAttributeNames: {
        '#testStationPNumber': 'testStationPNumber'
      },
      ExpressionAttributeValues: {
        ':testStationPNumber': testStationPNumber
      }
    }

    return dbClient.query(params).promise()
  }

  createMultiple (testStationItems) {
    var params = this.generatePartialParams()

    testStationItems.forEach(testStationItem => {
      params.RequestItems[this.tableName].push(
        {
          PutRequest:
            {
              Item: testStationItem
            }
        })
    })

    return dbClient.batchWrite(params).promise()
  }

  deleteMultiple (primaryKeysToBeDeleted) {
    var params = this.generatePartialParams()

    primaryKeysToBeDeleted.forEach(key => {
      params.RequestItems[this.tableName].push(
        {
          DeleteRequest:
          {
            Key:
            {
              testStationId: key
            }
          }
        }
      )
    })

    return dbClient.batchWrite(params).promise()
  }

  generatePartialParams () {
    return {
      RequestItems:
      {
        [this.tableName]: []
      }
    }
  }
}

module.exports = TestStationDAO
