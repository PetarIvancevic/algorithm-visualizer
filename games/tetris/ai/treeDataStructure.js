import _ from 'lodash'

import constants from 'games/tetris/ai/constants'
import gameLogic from 'games/tetris/ai/gameLogic'

function getBoardVector (board) {
  const boardVector = []
  // const occupiedRows = gameLogic.populateLowestFourYCoordsFromOccupiedPositions(board)

  for (let row = 0; row < constants.ai.VECTOR_ROW_COUNT; row++) {
    for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
      boardVector.push(board[column][row] ? 1 : 0)
    }
  }

  return boardVector
}

/*
  Board vector will represent the height of the columns
  5 digits for one column
  10 columns
*/

function getHeightBoardVector (board) {
  let heightBinaryDigits = []

  function fillToFiveDigits (columnPopulation) {
    let fiveDigitsColumn = _.map(columnPopulation.toString(2), val => _.toNumber(val))

    while (_.size(fiveDigitsColumn) < 5) {
      fiveDigitsColumn.unshift(0)
    }

    return fiveDigitsColumn
  }

  for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
    let firstIndex = _.findIndex(board[column], val => val)
    let columnPopulation = firstIndex < 0 ? 0 : (20 - firstIndex)
    heightBinaryDigits.push(fillToFiveDigits(columnPopulation))
  }

  return _.flatten(heightBinaryDigits)
}

function getFirstPopulatedBlockInColumn (column) {
  let firstBlockIndex = _.findIndex(column, val => val)
  return firstBlockIndex < 0 ? 0 : firstBlockIndex
}

function getFirstEmptyBlockInColumn (column) {
  let firstEmptyBlockIndex = _.lastIndexOf(column, val => !val)
  return firstEmptyBlockIndex < 0 ? 0 : firstEmptyBlockIndex
}

function getHoleVector (board) {
  let columnHoles = []

  for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
    let firstBlockIndex = getFirstPopulatedBlockInColumn(board[column])
    let firstEmptyBlockIndex = getFirstEmptyBlockInColumn(board[column])

    columnHoles.push(firstEmptyBlockIndex > firstBlockIndex ? 1 : 0)
  }

  return columnHoles
}

function isBumpinesToHighCompareFn (columnA, columnB) {
  let columnAFirstBlockIndex = getFirstPopulatedBlockInColumn(columnA)
  let columnBFirstBlockIndex = getFirstPopulatedBlockInColumn(columnB)

  if ((columnAFirstBlockIndex - 2) > columnBFirstBlockIndex) {
    return true
  } else if (columnAFirstBlockIndex < (columnBFirstBlockIndex - 2)) {
    return true
  }
  return false
}

function getBumpinesVector (board) {
  let bumpinesVector = []

  bumpinesVector.push(isBumpinesToHighCompareFn(board[0], board[1]) ? 1 : 0)

  for (let column = 1; column < (constants.ai.COLUMN_COUNT - 1); column++) {
    let leftBumpinesBoolVal = isBumpinesToHighCompareFn(
      board[column - 1],
      board[column]
    )
    let rightBumpinesBoolVal = isBumpinesToHighCompareFn(
      board[column],
      board[column + 1]
    )

    bumpinesVector.push(leftBumpinesBoolVal && rightBumpinesBoolVal ? 1 : 0)
  }

  bumpinesVector.push(
    isBumpinesToHighCompareFn(
      board[constants.ai.COLUMN_COUNT - 2],
      board[constants.ai.COLUMN_COUNT - 1]
    ) ? 1 : 0
  )

  return bumpinesVector
}

/*
  Combine different features
  - column height
  - has/doesn't have a reward
  - has hole for each column
  - bumpines too high
*/
function getFinalBoardVector (board, reward) {
  let finalVector = []

  finalVector.push(getHeightBoardVector(board))
  finalVector.push(getHoleVector(board))
  // finalVector.push(getBumpinesVector(board))

  let binaryReward = reward > 0 ? 1 : 0
  finalVector.push(binaryReward)

  return _.flatten(finalVector)
}

const TreeNode = function (parentNode, currentBlock) {
  this.children = []
  this.parent = parentNode
  this.block = _.cloneDeep(currentBlock)
  this.numMoves = 0
  this.reward = 0

  this.setNumMoves = function (numMoves) {
    this.numMoves = numMoves
  }

  this.addChild = function (childNode) {
    this.children.push(childNode)
  }

  this.setReward = function (reward) {
    this.reward = reward
  }

  this.setBoardVector = function (board, occupiedRows) {
    const cleanedBoard = gameLogic.pushFullRowsDown(board, occupiedRows)
    // this.boardVector = getFinalBoardVector(cleanedBoard, this.reward)
    this.boardVector = getBoardVector(cleanedBoard)
  }
}

export default TreeNode
