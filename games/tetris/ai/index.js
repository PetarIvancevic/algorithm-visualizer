import 'isomorphic-fetch'
import _ from 'lodash'
import brain from 'brain.js'

import TetrisGame from 'games/tetris'

const aiConstants = {
  COLUMN_COUNT: 10,
  ROW_COUNT: 4
}

function pushFullRowsDown (board) {
  let tempGameBoard = _.cloneDeep(board)

  function boardHasFullRows () {
    for (let row = 19; row >= 0; row--) {
      let rowIsFull = true

      for (let column = 0; column < aiConstants.COLUMN_COUNT; column++) {
        if (!tempGameBoard[column][row]) {
          rowIsFull = false
          break
        }
      }

      if (rowIsFull) {
        return true
      }
    }

    return false
  }

  function pushRowsDownFromIndex (rowIndex) {
    for (let column = 0; column < aiConstants.COLUMN_COUNT; column++) {
      delete tempGameBoard[column][rowIndex]
    }

    for (let row = rowIndex; row > 0; row--) {
      for (let column = 0; column < aiConstants.COLUMN_COUNT; column++) {
        tempGameBoard[column][row] = tempGameBoard[column][row - 1]
      }
    }

    for (let column = 0; column < aiConstants.COLUMN_COUNT; column++) {
      tempGameBoard[column][0] = null
    }
  }

  while (boardHasFullRows()) {
    for (let row = 19; row >= 0; row--) {
      let isRowFull = true

      for (let column = 0; column < aiConstants.COLUMN_COUNT; column++) {
        if (!tempGameBoard[column][row]) {
          isRowFull = false
        }
      }

      if (isRowFull) {
        pushRowsDownFromIndex(row)
        row++
      }
    }
  }

  return tempGameBoard
}

function getBoardVector (board, occupiedRows) {
  const boardVector = []

  for (let i = 0; i < aiConstants.ROW_COUNT; i++) {
    for (let column = 0; column < aiConstants.COLUMN_COUNT; column++) {
      boardVector.push(board[column][occupiedRows[i]] ? 1 : 0)
    }
  }

  return boardVector
}

const TreeNode = function (parentNode, currentBlock) {
  this.children = []
  this.parent = parentNode
  this.block = _.cloneDeep(currentBlock)
  this.reward = 0
  this.board = []

  this.addChild = function (childNode) {
    this.children.push(childNode)
  }

  this.setReward = function (reward) {
    if (reward < 0) {
      reward = -1
    }

    this.reward = reward
  }

  this.setBoardVector = function (board, occupiedRows) {
    const cleanedBoard = pushFullRowsDown(board)
    this.boardVector = getBoardVector(cleanedBoard, occupiedRows)
  }

  this.setFinalOutput = function () {
    this.output = this.reward * netConfig.net.run(this.boardVector)
  }
}

/*
  Make move with block
  - left
  - right
  - down (to lowest point bottom)
  - rotate
*/

function makeMove (currentBlock, move, checkCollisionFn) {
  if (move === 'right' || move === 'left') {
    currentBlock.move(move)
  } else if (move === 'down') {
    while (currentBlock.isMovable) {
      currentBlock.advance(checkCollisionFn)
    }
  } else if (move === 'rotate') {
    currentBlock.changeRotation()
  }

  return currentBlock
}

/*
  Generate all possible moves
*/

function generateMoves (currentBlock, checkCollisionFn) {
  if (!currentBlock.isMovable) {
    return []
  }

  const possibleMoves = _.map(['left', 'right', 'rotate'], function (move) {
    return makeMove(_.cloneDeep(currentBlock), move)
  })
  possibleMoves.push(makeMove(_.cloneDeep(currentBlock), 'down', checkCollisionFn))

  return possibleMoves
}

function stripDuplicateMoves (newBlockMoves, allBlockMoveNodes) {
  let uniqueBlockMoves = []

  _.each(newBlockMoves, function (newBlockMove) {
    let duplicateBlock = _.find(allBlockMoveNodes, function (blockMoveNode) {
      return _.isEqual(blockMoveNode.block.occupiedPositions, newBlockMove.occupiedPositions)
    })

    if (!duplicateBlock) {
      uniqueBlockMoves.push(newBlockMove)
    }
  })

  return uniqueBlockMoves
}

function getParentNode (parentMove, allMoveNodes) {
  return _.find(allMoveNodes, function (moveNode) {
    return _.isEqual(moveNode.block.occupiedPositions, parentMove.occupiedPositions)
  })
}

function addRowCoord (occupiedRows) {
  if ((_.max(occupiedRows) + 1) <= 19) {
    occupiedRows.push(_.max(occupiedRows) + 1)
  } else {
    occupiedRows.push(_.min(occupiedRows) - 1)
  }
}

function populateToFourYCoords (occupiedPositions) {
  let occupiedRows = _(occupiedPositions).map('y').union().value()
  const numYCoords = _.size(occupiedRows)

  if (numYCoords !== 4) {
    for (let i = 0; i < (4 - numYCoords); i++) {
      addRowCoord(occupiedRows)
    }
  }

  _.sortBy(occupiedRows, x => x)
  return occupiedRows
}

// Neural network will do this

// function getRowPopulationData (board, occupiedRows) {
//   const rowPopulationData = {
//     additionalPointsForLowerRows: 0,
//     boardVector: [],
//     emptyBlocks: 0,
//     fullRowCount: 0,
//   }

//   for (let i = 0; i < 4; i++) {
//     let currentRow = occupiedRows[i]
//     let rowIsFull = true

//     for (let column = 0; column < 10; column++) {
//       rowPopulationData.boardVector.push(board[column][currentRow] ? 1 : 0)

//       if (!board[column][currentRow]) {
//         rowIsFull = false
//         rowPopulationData.emptyBlocks++
//       }
//       let isFilled = board[column][currentRow] ? 1 : -1
//       rowPopulationData.additionalPointsForLowerRows += (0.5 * currentRow * isFilled)
//     }

//     if (rowIsFull) {
//       rowPopulationData.fullRowCount++
//     }
//   }

//   return rowPopulationData
// }

function getRowPopulationData (board, occupiedRows) {
  const rowPopulationData = {
    fullRowCount: 0
  }

  for (let i = 0; i < aiConstants.ROW_COUNT; i++) {
    let currentRow = occupiedRows[i]
    let rowIsFull = true

    for (let column = 0; column < aiConstants.COLUMN_COUNT; column++) {
      if (!board[column][currentRow]) {
        rowIsFull = false
        break
      }
    }

    if (rowIsFull) {
      rowPopulationData.fullRowCount++
    }
  }

  return rowPopulationData
}

function calculateReward (fullRowCount, minimalRowIndex) {
  if (minimalRowIndex < 4) {
    return -1000
  }
  const bonusPoints = fullRowCount > 1 ? fullRowCount * 0.5 : 0

  return fullRowCount * 10 + (10 * bonusPoints)
}

function populateBoardWithMove (board, occupiedPositions, value) {
  _.each(occupiedPositions, function (occupiedPosition) {
    if (value) {
      board[occupiedPosition.x][occupiedPosition.y] = value
    } else {
      delete board[occupiedPosition.x][occupiedPosition.y]
    }
  })
}

function getMoveValue (moveNode, board) {
  // get unique Y coords
  let occupiedRows = populateToFourYCoords(moveNode.block.occupiedPositions)
  populateBoardWithMove(board, moveNode.block.occupiedPositions, 1)

  const rowPopulationData = getRowPopulationData(board, occupiedRows)
  const reward = calculateReward(rowPopulationData.fullRowCount, _.min(occupiedRows))
  moveNode.setReward(reward)
  moveNode.setBoardVector(board, occupiedRows)

  populateBoardWithMove(board, moveNode.block.occupiedPositions)

  return reward + netConfig.net.run(moveNode.boardVector)
}

function getAllMoveNodes (tetrisGame) {
  let allMoveNodes = [new TreeNode(null, tetrisGame.getCurrentBlock())]
  let blockPositions = [_.cloneDeep(tetrisGame.getCurrentBlock())]

  while (_.size(blockPositions)) {
    let parentMove = blockPositions.pop()
    let newMoves = generateMoves(parentMove, tetrisGame.getCheckCollisionFn())
    let newUniqueMoves = stripDuplicateMoves(newMoves, allMoveNodes)
    let parentNode = getParentNode(parentMove, allMoveNodes)
    let uniqueMoveNodes = _.map(newUniqueMoves, function (uniqueMove) {
      let newChild = new TreeNode(parentNode, uniqueMove)
      parentNode.addChild(newChild)
      return newChild
    })

    allMoveNodes = _.concat(uniqueMoveNodes, allMoveNodes)
    blockPositions = _.concat(newUniqueMoves, blockPositions)
  }

  return allMoveNodes
}

function getBestMoveNode (tetrisGame) {
  const allMoveNodes = getAllMoveNodes(tetrisGame)
  let bestMoves = {moveValue: -100000, sameValueMoveIndexes: []}

  _.each(allMoveNodes, function (moveNode, index) {
    if (moveNode.block.isMovable) return

    let moveValue = getMoveValue(moveNode, tetrisGame.getBoard())
    moveNode.setFinalOutput()

    if (moveValue === bestMoves.moveValue) {
      bestMoves.sameValueMoveIndexes.push(index)
    }

    if (moveValue > bestMoves.moveValue) {
      bestMoves = {
        moveValue,
        sameValueMoveIndexes: [index]
      }
    }
  })
  const bestMoveIndex = bestMoves.sameValueMoveIndexes[_.random(_.size(bestMoves.sameValueMoveIndexes) - 1)]

  return allMoveNodes[bestMoveIndex]
}

function playOneEpisode (tetrisGame) {
  let allBestMoveNodes = []

  while (!tetrisGame.isGameOver()) {
    let bestMoveNode = getBestMoveNode(tetrisGame)

    if (!bestMoveNode) {
      break
    }

    allBestMoveNodes.push(bestMoveNode)
    tetrisGame.AIAdvanceGame(bestMoveNode.block)
  }
  return allBestMoveNodes
}

function stripAllMovesData (moves) {
  return _.map(moves, function (moveData) {
    return _.pick(moveData, ['boardVector', 'reward', 'output'])
  })
}

async function writeMovesToFile (moves) {
  const gameData = stripAllMovesData(moves[0])

  await fetch('/api/write', { // eslint-disable-line
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameData)
  })
}

function updateNetwork (allMoveNodes) {
  const moves = stripAllMovesData(allMoveNodes[0])
  const numMoves = _.size(moves)

  function recursiveTraining (input, index) {
    // no more inputs
    if (!moves[index]) {
      return [0]
    }

    const networkOutput = recursiveTraining(_.get(moves, `[${index}].boardVector`), index + 1)

    netConfig.net.train({
      input,
      output: [_.get(moves, `[${index}].reward`) + networkOutput]
    }, {
      iterations: 1
    })

    const currentNetworkOutput = netConfig.net.run(input)
    console.log(`
      MOVE: ${index} / ${numMoves}
      INPUT: ${input}
      REWARD: ${moves[index].reward}
      OUTPUT: ${currentNetworkOutput}
    `)

    return currentNetworkOutput
  }

  if (!_.size(moves)) {
    console.log('No more updates!') // Maybe it could happen?
    return
  }

  let oldRes = netConfig.net.run(moves[0].boardVector)

  console.log('Training...')
  recursiveTraining(moves[0].boardVector, 0)

  console.log(`
    OLD: ${oldRes}
    NEW: ${netConfig.net.run(moves[0].boardVector)}
  `)
}

/*
  BUTTON FUNCTIONS
*/

async function train (numGames) {
  if (!netConfig.net) {
    window.alert('The network is not created! You probably forgot to call create!')
    return
  }

  const NUM_GAMES_TO_PLAY = numGames || 10
  const gamePoints = []
  const allMoveNodes = []

  for (let i = 0; i < NUM_GAMES_TO_PLAY; i++) {
    console.log('Playing...')
    let tetrisGame = new TetrisGame(3, true)
    window.GAME = tetrisGame
    allMoveNodes.push(playOneEpisode(tetrisGame))
    gamePoints.push(tetrisGame.getScore())
    updateNetwork(allMoveNodes)
  }

  await writeMovesToFile(allMoveNodes)

  let groupedResults = _.groupBy(gamePoints)
  _.each(groupedResults, function (resultArray) {
    console.log(`Points: ${resultArray[0]}`, _.size(resultArray))
  })
}

// global neural network
let netConfig = {
  net: null,
  learningRate: 0.3
}

function create (learningRate) {
  function createHiddenLayers () {
    const hiddenLayers = []

    for (let i = 145; i > 0; i--) {
      hiddenLayers.push(20)
    }

    return _.concat(hiddenLayers, [10, 7, 5, 3, 2])
  }

  function constructNetworkInitialData (input, output) {
    const initialData = {
      input: input || [],
      output: output || [0]
    }
    const vectorSize = aiConstants.COLUMN_COUNT * aiConstants.ROW_COUNT

    for (let i = 0; i < vectorSize; i++) {
      initialData.input.push(0)
    }

    return initialData
  }

  netConfig = {
    learningRate: learningRate || netConfig.learningRate,
    net: new brain.NeuralNetwork({
      hiddenLayers: createHiddenLayers()
    })
  }

  // initial train
  netConfig.net.train(constructNetworkInitialData(), {iterations: 1})
  // expose the net to the window
  window.NET = netConfig.net
}

export default {
  create,
  train
}
