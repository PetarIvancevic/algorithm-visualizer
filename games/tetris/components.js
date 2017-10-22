import _ from 'lodash'

import {games} from 'constants'

const baseBlock = function (nextBlockFn, isRotationPossibleFn) {
  this.isMovable = true

  this.advance = function (checkCollision, boardHeight = 20) {
    let occupiedPositionsSize = _.size(this.occupiedPositions)

    for (let i = 0; i < occupiedPositionsSize; i++) {
      let newYPosition = this.occupiedPositions[i].y + 1

      if (newYPosition === 20 || checkCollision(this.occupiedPositions[i].x, newYPosition)) {
        this.isMovable = false
        nextBlockFn(this.type, this.occupiedPositions)
      }
    }

    if (!this.isMovable) {
      return
    }

    for (let i = 0; i < occupiedPositionsSize; i++) {
      this.occupiedPositions[i].y++
    }
  }

  this.move = function (direction) {
    let newPositions = []
    let movement = (direction === 'left') ? -1 : 1

    for (let i = 0; i < _.size(this.occupiedPositions); i++) {
      let {x, y} = this.occupiedPositions[i]

      newPositions[i] = {x, y}

      if (direction === 'down') {
        newPositions[i].y += 1
      } else {
        newPositions[i].x += movement
      }
    }

    if (isRotationPossibleFn(newPositions)) {
      this.occupiedPositions = newPositions
    }
  }
}

// I-block
const IBlock = function (nextBlockFn, isRotationPossibleFn) {
  baseBlock.call(this, nextBlockFn, isRotationPossibleFn)

  this.type = games.tetris.blockTypes.IBlock
  const possibleRotations = 2
  let currentRotation = _.random(1, possibleRotations)
  let tempRotation = currentRotation

  this.occupiedPositions = []

  this.populateRotationPositions = function () {
    const currentCoordinates = this.occupiedPositions[0] || {x: 4, y: currentRotation === 1 ? 3 : 0}
    let newPositions = []

    if (tempRotation === 1) {
      for (let i = 0; i < 4; i++) {
        newPositions[i] = {
          x: currentCoordinates.x,
          y: currentCoordinates.y - i
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        newPositions[i] = {
          x: currentCoordinates.x + i,
          y: currentCoordinates.y
        }
      }
    }

    if (isRotationPossibleFn(newPositions)) {
      this.occupiedPositions = newPositions
      currentRotation = tempRotation
    }
  }

  this.changeRotation = function () {
    tempRotation = (tempRotation % 2) + 1
    this.populateRotationPositions()
  }

  this.populateRotationPositions()
}

// J-block
const JBlock = function (nextBlockFn, isRotationPossibleFn) {
  baseBlock.call(this, nextBlockFn, isRotationPossibleFn)

  this.occupiedPositions = [{}]
}

// L-block
const LBlock = function (nextBlockFn, isRotationPossibleFn) {
  baseBlock.call(this, nextBlockFn, isRotationPossibleFn)

  this.occupiedPositions = [{}]
}

// O-block
const OBlock = function (nextBlockFn, isRotationPossibleFn) {
  baseBlock.call(this, nextBlockFn, isRotationPossibleFn)

  this.type = games.tetris.blockTypes.OBlock
  this.occupiedPositions = [{
    x: 4, y: 0
  }, {
    x: 5, y: 0
  }, {
    x: 4, y: 1
  }, {
    x: 5, y: 1
  }]

  this.changeRotation = function () {}
}

// S-block
const SBlock = function (nextBlockFn, isRotationPossibleFn) {
  baseBlock.call(this, nextBlockFn, isRotationPossibleFn)

  this.occupiedPositions = [{}]
}

// T-block
const TBlock = function (nextBlockFn, isRotationPossibleFn) {
  baseBlock.call(this, nextBlockFn, isRotationPossibleFn)

  this.occupiedPositions = [{}]
}

// Z-block
const ZBlock = function (nextBlockFn, isRotationPossibleFn) {
  baseBlock.call(this, nextBlockFn, isRotationPossibleFn)

  this.occupiedPositions = [{}]
}

export default {
  IBlock,
  JBlock,
  LBlock,
  OBlock,
  SBlock,
  TBlock,
  ZBlock
}
