import 'isomorphic-fetch'
import _ from 'lodash'
import brain from 'brain.js'

import constants from 'games/tetris/ai/constants'
import simulator from 'games/tetris/ai/simulator'
import TetrisGame from 'games/tetris'

const aiTrackers = {
  CURRENT_GAME: 0,
  TOTAL_SET_NUM_GAMES: 0
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

// async function writeMovesToFile (moves) {
//   const gameData = stripAllMovesData(moves[0])

//   await fetch('/api/write', { // eslint-disable-line
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(gameData)
//   })
// }

// function stripMovesDataForNetworkUpdate (moves) {
//   return _.map(moves, function (moveData) {
//     return _.pick(moveData, ['boardVector', 'reward', 'output', 'numMoves'])
//   })
// }

// REWARD should be between 0 - 0.4
// because the net output is limited to 0.6  OLD
// function normalizeReward (reward) {
//   return reward ? reward / 100 : 0
// }

function sigmoidNormalize (result) {
  return result < 0 ? 0 : result
}

// function reluNormalize (result) {
//   return result > 10 ? 10 : result
// }

function getNullVector () {
  let arr = []

  for (let i = 0; i < 40; i++) {
    arr.push(0)
  }

  return arr
}

function updateNetwork (gameAllMoves) {
  // const moves = stripMovesDataForNetworkUpdate(gameAllMoves)
  const moves = gameAllMoves
  const numMoves = _.size(moves)

  let oldRes = netConfig.net.run(getNullVector())
  const trainingSets = []
  let finalReward = 0

  console.log('Training...')
  for (let i = 0; i < numMoves - 1; i++) {
    if (moves[i].reward >= 0) {
      finalReward += moves[i].reward
    }

    // console.log(moves[i])

    trainingSets.push({
      boardVector: moves[i].boardVector,
      netOutput: [sigmoidNormalize(moves[i].reward + 0.7 * netConfig.netNormalizedOutput(moves[i + 1].boardVector)[0])]
    })
  }

  netConfig.net.train(_.map(trainingSets, function (trainingSet) {
    return {
      input: trainingSet.boardVector,
      output: trainingSet.netOutput
    }
  }), {
    iterations: 1
  })

  console.log(`
    GAME: ${aiTrackers.CURRENT_GAME} / ${aiTrackers.TOTAL_SET_NUM_GAMES}
    OLD: ${oldRes}
    NEW: ${netConfig.net.run(getNullVector())[0]}
    NUMBER OF MOVES: ${numMoves}
    REWARD: ${finalReward}
  `)
}

/*
  BUTTON FUNCTIONS
*/

// global neural network
let netConfig = {
  net: null,
  learningRate: 0.3,
  netNormalizedOutput: function (input) {
    // return this.net.run(input)
    const netResult = this.net.run(input)
    return netResult[0] > 0.6 ? [0.6] : netResult
  }
}

function create (learningRate) {
  function createHiddenLayers () {
    return [200]
  }

  function constructNetworkInitialData (input, output) {
    const initialData = [{
      input: [],
      output: [1]
    }, {
      input: [],
      output: [1]
    }]
    const vectorSize = constants.ai.COLUMN_COUNT * constants.ai.ROW_COUNT

    for (let i = 0; i < vectorSize; i++) {
      initialData[0].input.push(0)
      initialData[1].input.push(1)
    }

    return initialData
  }

  netConfig = _.assign({}, netConfig, {
    net: new brain.NeuralNetwork({
      learningRate: _.toNumber(learningRate || netConfig.learningRate),
      activation: 'sigmoid',
      hiddenLayers: createHiddenLayers()
    })
  })

  // initial train
  netConfig.net.train(constructNetworkInitialData(), {iterations: 1})
  // expose the net to the window
  window.NET = netConfig.net
}

async function train (numGames) {
  if (!netConfig.net) {
    window.alert('The network is not created! You probably forgot to call create!')
    return
  }

  const NUM_GAMES_TO_PLAY = numGames || aiTrackers.NUM_GAMES_TO_PLAY
  const gamePoints = []
  let allMoveNodes = []
  const chartData = []

  aiTrackers.TOTAL_SET_NUM_GAMES = NUM_GAMES_TO_PLAY
  aiTrackers.CURRENT_GAME = 0

  for (let i = 0; i < NUM_GAMES_TO_PLAY; i++) {
    console.log('Playing...')
    aiTrackers.CURRENT_GAME++
    let tetrisGame = new TetrisGame(3, true)
    allMoveNodes.push(simulator.playOneEpisode(tetrisGame, netConfig))
    gamePoints.push(tetrisGame.getScore())
    chartData.push({
      totalPoints: tetrisGame.getScore(),
      firstMoveNetValue: netConfig.net.run(_.last(allMoveNodes)[0].boardVector)[0],
      numMoves: _.size(_.last(allMoveNodes))
    })
    updateNetwork(_.last(allMoveNodes))
    chartData[i].firstMoveNetValueAfterTraining = netConfig.net.run(_.last(allMoveNodes)[0].boardVector)[0]
    allMoveNodes = []
  }

  // await writeMovesToFile(allMoveNodes)

  let groupedResults = _.groupBy(gamePoints)
  _.each(groupedResults, function (resultArray) {
    console.log(`
      Game Points: ${resultArray[0]}
      Number of games with points: ${_.size(resultArray)}
    `)
  })

  return chartData
}

export default {
  create,
  train
}
