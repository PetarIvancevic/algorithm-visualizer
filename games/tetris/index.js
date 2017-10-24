import _size from 'lodash/size'
import _keys from 'lodash/keys'
import _random from 'lodash/random'
import gameBlocks from './components'
import {games} from 'constants'

const game = function (difficulty) {
  let gameBoard = new Array(10)
  let gameOver = false
  let score = 0
  let frame = 1
  let currentBlock, currentBlockType, nextBlockType

  const possibleBlockTypes = _keys(games.tetris.blockTypes)

  const advanceCurrentBlock = function () {
    if (frame % difficulty === 0) {
      currentBlock.advance(checkCollision)
    }
    frame++
  }

  this.advanceGame = function () {
    if (gameOver) {
      return
    }
    advanceCurrentBlock()
  }

  const createBlock = function () {
    currentBlock = new gameBlocks[currentBlockType](fixateBlockAndSetNewBlock, isRotationPossible)

    for (let i = 0; i < _size(currentBlock.occupiedPositions); i++) {
      let {x, y} = currentBlock.occupiedPositions[i]

      if (checkCollision(x, y)) {
        return endGame()
      }
    }
  }

  const createGameBoard = function () {
    for (let i = 0; i < 10; i++) {
      gameBoard[i] = new Array(20)
    }
  }

  const checkCollision = function (x, y) {
    return !!gameBoard[x][y]
  }

  const endGame = function () {
    gameOver = true
    document.body.removeEventListener('keypress', registerEventListeners)
  }

  const fixateBlockAndSetNewBlock = function (type, occupiedPositions) {
    for (let i = 0; i < _size(occupiedPositions); i++) {
      let {x, y} = occupiedPositions[i]

      gameBoard[x][y] = {type}
    }

    setupNextBlock()
    const fullRowCount = getFullRowsCount()
    createBlock()

    if (fullRowCount) {
      score += fullRowCount * 10
      pushFullRowsDown()
    }
  }

  this.getBoard = function () { return gameBoard }

  this.getScore = function () { return score }

  this.getNextBlock = function () { return nextBlockType }

  this.getCurrentBlock = function () { return currentBlock }

  this.isGameOver = function () { return gameOver }

  const isRotationPossible = function (positions) {
    for (let i = 0; i < _size(positions); i++) {
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

  const getRandomBlockType = function () {
    return possibleBlockTypes[_random(0, _size(possibleBlockTypes) - 1)]
  }

  const setupNextBlock = function () {
    currentBlockType = nextBlockType
    nextBlockType = getRandomBlockType()
  }

  const pushFullRowsDown = function () {
    function pushRowsDownFromIndex (rowIndex) {
      for (let i = 0; i < 10; i++) {
        delete tempGameBoard[i][rowIndex]
      }

      for (let i = rowIndex; i > 0; i--) {
        for (let j = 0; j < 10; j++) {
          tempGameBoard[j][i] = tempGameBoard[j][i - 1]
        }
      }

      for (let i = 0; i < 10; i++) {
        tempGameBoard[i][0] = null
      }
    }

    let tempGameBoard = []

    for (let i = 0; i < 10; i++) {
      tempGameBoard[i] = gameBoard[i].slice()
    }

    while (getFullRowsCount(tempGameBoard)) {
      for (let i = 19; i >= 0; i--) {
        let isRowFull = true

        for (let j = 0; j < 10; j++) {
          if (!tempGameBoard[j][i]) {
            isRowFull = false
          }
        }

        if (isRowFull) {
          pushRowsDownFromIndex(i)
          i++
        }
      }
    }

    gameBoard = tempGameBoard
  }

  const getFullRowsCount = function (tempGameBoard = gameBoard) {
    let numberOfFullRows = 0

    for (let i = 19; i >= 0; i--) {
      let isRowFull = true

      for (let j = 0; j < 10; j++) {
        if (!tempGameBoard[j][i]) {
          isRowFull = false
        }
      }

      if (isRowFull) {
        numberOfFullRows++
      }
    }

    return numberOfFullRows
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
