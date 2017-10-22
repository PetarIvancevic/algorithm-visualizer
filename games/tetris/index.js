import _ from 'lodash'
import gameBlocks from './components'
import {games} from 'constants'

const game = function (difficulty) {
  const gameBoard = new Array(10)
  let gameOver = false
  let score = 0
  let frame = 1
  let currentBlock, currentBlockType, nextBlockType

  const possibleBlockTypes = _.keys(games.tetris.blockTypes)

  this.advanceGame = function () {
    if (gameOver) {
      return
    }
    advanceCurrentBlock()
  }

  this.getBoard = function () { return gameBoard }

  this.getScore = function () { return score }

  this.getNextBlock = function () { return nextBlockType }

  this.getCurrentBlock = function () { return currentBlock }

  const createGameBoard = function () {
    for (let i = 0; i < 10; i++) {
      gameBoard[i] = new Array(20)
    }
  }

  const advanceCurrentBlock = function () {
    if (frame % difficulty === 0) {
      currentBlock.advance(checkCollision)
    }
    frame++
  }

  const checkCollision = function (x, y) {
    return !!gameBoard[x][y]
  }

  const isRotationPossible = function (positions) {
    for (let i = 0; i < _.size(positions); i++) {
      let {x, y} = positions[i]

      if (positions[i].x < 0 || positions[i].x > 9 || positions[i].y < 0 || positions[i].y > 19) {
        return false
      }

      if (gameBoard[x][y]) {
        return false
      }
    }

    return true
  }

  const endGame = function () {
    gameOver = true
    document.body.removeEventListener('keypress', registerEventListeners)
    console.log('endGame')
  }

  const getRandomBlockType = function () {
    return possibleBlockTypes[_.random(0, _.size(possibleBlockTypes) - 1)]
  }

  const setupNextBlock = function () {
    currentBlockType = nextBlockType
    nextBlockType = getRandomBlockType()
  }

  const pushDownFromHeight = function (height) {
    for (let i = 0; i < 10; i++) {
      for (let j = height; j >= 0; j--) {
        if (j === 0) {
          delete gameBoard[i][j]
        } else {
          gameBoard[i][j] = gameBoard[i][j - 1]
        }
      }
    }
  }

  const checkForFullRows = function () {
    let numberOfFullRows = 0

    for (let i = 19; i >= 0; i--) {
      let isRowFull = true

      for (let j = 0; j < 10; j++) {
        if (!gameBoard[j][i]) {
          isRowFull = false
        }
      }

      if (isRowFull) {
        numberOfFullRows++
        pushDownFromHeight(i)
      }
    }

    score += numberOfFullRows
  }

  const fixateBlockAndGetNew = function (type, occupiedPositions) {
    for (let i = 0; i < _.size(occupiedPositions); i++) {
      let {x, y} = occupiedPositions[i]

      gameBoard[x][y] = {type}
    }

    setupNextBlock()
    checkForFullRows()
    createBlock()

    for (let i = 0; i < _.size(currentBlock.occupiedPositions); i++) {
      let {x, y} = currentBlock.occupiedPositions[i]

      if (checkCollision(x, y)) {
        return endGame()
      }
    }
  }

  const createBlock = function () {
    currentBlock = new gameBlocks[currentBlockType](fixateBlockAndGetNew, isRotationPossible)
  }

  const registerEventListeners = function (event) {
    const key = event.key

    if (key === 'x') {
      currentBlock.changeRotation()
    } else if (key === 'a') {
      currentBlock.move('left')
    } else if (key === 'd') {
      currentBlock.move('right')
    } else if (key === 's') {
      currentBlock.move('down')
    }
  }

  const init = function () {
    score = 0
    createGameBoard()
    nextBlockType = getRandomBlockType()
    setupNextBlock()
    createBlock()

    document.body.addEventListener('keypress', registerEventListeners)
  }

  init()
}

export default game
