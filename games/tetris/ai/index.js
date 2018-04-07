import _ from 'lodash'

import TetrisGame from 'games/tetris'

const TreeNode = function (parentNode, currentBlock) {
  this.children = []
  this.parent = parentNode
  this.block = _.cloneDeep(currentBlock)

  this.addChild = function (childNode) {
    this.children.push(childNode)
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

function addYCoord (occupiedYPositions) {
  if ((_.max(occupiedYPositions) + 1) <= 19) {
    occupiedYPositions.push(_.max(occupiedYPositions) + 1)
  } else {
    occupiedYPositions.push(_.min(occupiedYPositions) - 1)
  }
}

function populateToFourYCoords (occupiedPositions) {
  let occupiedYPositions = _(occupiedPositions).map('y').union().value()
  const numYCoords = _.size(occupiedYPositions)

  if (numYCoords !== 4) {
    for (let i = 0; i < (4 - numYCoords); i++) {
      addYCoord(occupiedYPositions)
    }
  }

  return occupiedYPositions
}

function getRowPopulationData (board, occupiedYPositions) {
  const rowPopulationData = {
    fullRowCount: 0,
    emptyBlocks: 0
  }

  for (let i = 0; i < 4; i++) {
    let currentRow = occupiedYPositions[i]
    let rowIsFull = true

    for (let column = 0; column < 10; column++) {
      if (!board[column][currentRow]) {
        rowIsFull = false
        rowPopulationData.emptyBlocks++
      }
    }

    if (rowIsFull) {
      rowPopulationData.fullRowCount++
    }
  }

  return rowPopulationData
}

function calculateReward (board, occupiedYPositions, minialYIndex) {
  if (minialYIndex < 4) {
    return -1000
  }

  const rowPopulationData = getRowPopulationData(board, occupiedYPositions)
  const bonusPoints = rowPopulationData.fullRowCount > 1 ? rowPopulationData.fullRowCount * 0.5 : 0
  return rowPopulationData.fullRowCount * 10 + (10 * bonusPoints)

  // return score / (1 + rowPopulationData.emptyBlocks)
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
  let occupiedYPositions = populateToFourYCoords(moveNode.block.occupiedPositions)
  populateBoardWithMove(board, moveNode.block.occupiedPositions, 1)
  const reward = calculateReward(board, occupiedYPositions, _.min(occupiedYPositions))
  populateBoardWithMove(board, moveNode.block.occupiedPositions)

  return reward
}

function getBestMoveNode (tetrisGame) {
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

  let bestMoves = {moveValue: -100000, sameValueMoveIndexes: []}

  _.each(allMoveNodes, function (moveNode, index) {
    if (moveNode.block.isMovable) return

    let moveValue = getMoveValue(moveNode, tetrisGame.getBoard())

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
  let allBestMoves = []

  while (!tetrisGame.isGameOver()) {
    let bestMoveNode = getBestMoveNode(tetrisGame)

    if (!bestMoveNode) {
      break
    }

    tetrisGame.AIAdvanceGame(bestMoveNode.block)
  }
  return allBestMoves
}

function train () {
  const NUM_GAMES_TO_PLAY = 10000
  let gamePoints = []

  for (let i = 0; i < NUM_GAMES_TO_PLAY; i++) {
    console.log('Playing...')
    let tetrisGame = new TetrisGame(3, true)
    window.GAME = tetrisGame
    let episodeBestMoves = playOneEpisode(tetrisGame)
    gamePoints.push(tetrisGame.getScore())
  }

  let groupedResults = _.groupBy(gamePoints)
  _.each(groupedResults, function (resultArray) {
    console.log(`Points: ${resultArray[0]}`, _.size(resultArray))
  })
}

export default {
  train
}
