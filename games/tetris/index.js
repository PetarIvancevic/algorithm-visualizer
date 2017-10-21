import _ from 'lodash'
import gameBlocks from './components'
import {games} from 'constants'

const game = function (redrawFunction) {
  const gameBoard = new Array(10)
  let score = 0
  let currentBlock, currentBlockType, nextBlockType

  const possibleBlockTypes = _.keys(games.tetris.blockTypes)

  this.getBoard = function () {
    const cloneBoard = new Array(10)

    for (let i = 0; i < 10; i++) {
      cloneBoard[i] = gameBoard[i].slice()
    }

    return cloneBoard
  }

  this.getScore = function () { return score }

  this.getNextBlock = function () { return nextBlockType }

  this.getCurrentBlock = function () { return currentBlock }

  const createGameBoard = function () {
    for (let i = 0; i < 10; i++) {
      gameBoard[i] = new Array(20)
    }
  }

  const endGame = function () {
    console.log('endGame')
  }

  const getRandomBlockType = function () {
    return possibleBlockTypes[_.random(0, _.size(possibleBlockTypes) - 1)]
  }

  const setupNextBlock = function () {
    currentBlockType = nextBlockType
    nextBlockType = getRandomBlockType()
  }

  const createBlockInBoard = function () {
    currentBlock = _.assign({}, gameBlocks[currentBlockType])

    for (let i = 0; i < _.size(currentBlock.occupiedPositions); i++) {
      let {x, y} = currentBlock.occupiedPositions[i]
      if (gameBoard[x][y]) {
        return endGame()
      }

      gameBoard[x][y] = {type: currentBlock.type}
    }
  }

  const startFlow = function () {
    createBlockInBoard()

    redrawFunction()
  }

  const init = function () {
    score = 0
    createGameBoard()
    nextBlockType = getRandomBlockType()
    setupNextBlock()
    setTimeout(startFlow, 1000)
  }

  init()
}

export default game
