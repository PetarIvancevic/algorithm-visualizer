const _ = require('lodash')
const fs = require('fs')

function write (fileName, data) {
  return fs.appendFile(`./tetrisData/${fileName}`, `${data}\n`, function (err) {
    if (err) console.error(err)
  })
}

function writeOutput (outputData) {
  console.log('writing', outputData)
  return write('output.txt', outputData)
}

function writeInput (inputData) {
  return write('input.txt', inputData)
}

async function appendTetrisData (dataArray) {
  _.each(dataArray, async function (data) {
    await writeInput(data.boardVector)
    await writeOutput(data.output)
  })
}

module.exports = {
  appendTetrisData
}
