import _ from 'lodash'

import constants from 'games/tetris/ai/constants'
import gameLogic from 'games/tetris/ai/gameLogic'

function getBoardVector (board, occupiedRows) {
  const boardVector = []

  for (let i = 0; i < constants.ai.ROW_COUNT; i++) {
    for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
      boardVector.push(board[column][occupiedRows[i]] ? 1 : 0)
    }
  }

  return boardVector
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
    this.reward = (reward < 0) ? 0 : reward
  }

  this.setBoardVector = function (board, occupiedRows) {
    const cleanedBoard = gameLogic.pushFullRowsDown(board)
    this.boardVector = getBoardVector(cleanedBoard, occupiedRows)
  }
}

export default TreeNode
