import _ from 'lodash'

import {games} from 'constants'

const baseBlock = {
  alterShape: {},
  fixatePosition: function () {
    console.log('block cannot move any more')
  }
}

// I-block
const IBlock = {}

// J-block
const JBlock = {}

// L-block
const LBlock = {}

// O-block
const OBlock = _.assign({}, baseBlock, {
  type: games.tetris.blockTypes.OBlock,
  occupiedPositions: [{
    x: 4, y: 0
  }, {
    x: 5, y: 0
  }, {
    x: 4, y: 1
  }, {
    x: 5, y: 1
  }],
  changeOccupiedBoxes: function (newPositions) {
    console.log('add change function')
  }
})

// S-block
const SBlock = {}

// T-block
const TBlock = {}

// Z-block
const ZBlock = {}

export default {
  IBlock,
  JBlock,
  LBlock,
  OBlock,
  SBlock,
  TBlock,
  ZBlock
}
