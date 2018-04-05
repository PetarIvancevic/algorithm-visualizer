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

function train () {
  const tetrisGame = new TetrisGame(3, true)

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

  window.GAME = tetrisGame
}

export default {
  train
}
