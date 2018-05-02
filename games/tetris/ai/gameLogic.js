import _ from 'lodash'

import constants from 'games/tetris/ai/constants'

const BOARD_VECTOR_MAX_HEIGHT_INDEX = 4

function pushFullRowsDown (board, occupiedRows) {
  let tempGameBoard = []
  let sortedOccupiedRows = _.clone(occupiedRows)
  sortedOccupiedRows.sort()

  for (let column = 0; column < _.size(board); column++) {
    tempGameBoard[column] = []

    for (let occupiedRowIndex = 0; occupiedRowIndex < BOARD_VECTOR_MAX_HEIGHT_INDEX; occupiedRowIndex++) {
      tempGameBoard[column].push(board[column][occupiedRows[occupiedRowIndex]] ? 1 : 0)
    }
  }

  function boardHasFullRows () {
    // we are just working with 4 rows
    for (let row = BOARD_VECTOR_MAX_HEIGHT_INDEX; row >= 0; row--) {
      let rowIsFull = true

      for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
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
    for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
      delete tempGameBoard[column][rowIndex]
    }

    for (let row = rowIndex; row > 0; row--) {
      for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
        tempGameBoard[column][row] = tempGameBoard[column][row - 1]
      }
    }

    for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
      tempGameBoard[column][0] = null
    }
  }

  while (boardHasFullRows()) {
    for (let row = BOARD_VECTOR_MAX_HEIGHT_INDEX; row >= 0; row--) {
      let isRowFull = true

      for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function addRowCoord (occupiedRows) {
  if ((_.max(occupiedRows) + 1) <= 19) {
    occupiedRows.push(_.max(occupiedRows) + 1)
  } else {
    occupiedRows.push(_.min(occupiedRows) - 1)
  }
}

function getMoveValue (fullRowCount, minimalRowIndex) {
  if (minimalRowIndex < 4) {
    return -1000
  }
  return fullRowCount * 0.1
}

/*
  From lowest Y coordinate create 4 rows so we can create a board vector later
*/
function populateLowestFourYCoordsFromOccupiedPositions (occupiedPositions) {
  let occupiedRows = _(occupiedPositions).map('y').union().value()
  const numYCoords = _.size(occupiedRows)

  if (numYCoords !== 4) {
    for (let i = 0; i < (4 - numYCoords); i++) {
      addRowCoord(occupiedRows)
    }
  }

  return _.sortBy(occupiedRows, x => x)
}

/*
  Board is updated by REFERENCE
*/
function populateBoardWithActualMove (board, occupiedPositions, value) {
  for (let i = 0; i < _.size(occupiedPositions); i++) {
    if (value) {
      board[occupiedPositions[i].x][occupiedPositions[i].y] = value
    } else {
      delete board[occupiedPositions[i].x][occupiedPositions[i].y]
    }
  }
}

function getFullRowCount (board, occupiedRows) {
  let fullRowCount = 0

  for (let i = 0; i < constants.ai.ROW_COUNT; i++) {
    let currentRow = occupiedRows[i]
    let rowIsFull = true

    for (let column = 0; column < constants.ai.COLUMN_COUNT; column++) {
      if (!board[column][currentRow]) {
        rowIsFull = false
        break
      }
    }

    if (rowIsFull) {
      fullRowCount++
    }
  }

  return fullRowCount
}

export default {
  getMoveValue,
  getFullRowCount,
  pushFullRowsDown,
  populateLowestFourYCoordsFromOccupiedPositions,
  populateBoardWithActualMove
}
