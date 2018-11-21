const fs = require('fs')
const HTTPResponseStatus = require('../models/HTTPResponseStatus')
const path = require('path')

const getATFList = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../tests/resources/mock-atf.json'), 'utf8')))
    } catch (error) {
      reject(new HTTPResponseStatus(500, error.stack))
    }
  })
}

module.exports = getATFList
