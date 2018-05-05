import _size from 'lodash/size'
import {Component, h} from 'preact' //eslint-disable-line
import PropTypes from 'prop-types'

import Canvas from 'components/Canvas'
import Modal from 'components/Modal'
import TetrisGame from 'games/tetris/index'
import {games} from 'constants'

const tetrisCanvasAttributes = {
  backgroundColor: '#363636',
  gameAreaBorderColor: '#fff',
  height: 600,
  width: 600,
  heightOffset: 600 / 20,
  widthOffset: 300 / 10,
  gameAreaHeight: 600,
  gameAreaWidth: 300
}

const nextElementAreaConstants = {
  xStart: 375,
  yStart: 75,
  xEnd: 525,
  yEnd: 225
}

class DrawComponent extends Component {
  constructor (props) {
    super(props)

    this.clearRedrawInterval = this.clearRedrawInterval.bind(this)
    this.draw = this.draw.bind(this)
    this.drawBorderForGameArea = this.drawBorderForGameArea.bind(this)
    this.drawGameElements = this.drawGameElements.bind(this)
    this.drawGrid = this.drawGrid.bind(this)
    this.drawNextElement = this.drawNextElement.bind(this)
    this.drawScore = this.drawScore.bind(this)
    this.drawTextAtLocation = this.drawTextAtLocation.bind(this)
    this.endGame = this.endGame.bind(this)
    this.reDraw = this.reDraw.bind(this)
    this.startNewGame = this.startNewGame.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.playAIGame = this.playAIGame.bind(this)
    this.openModal = this.openModal.bind(this)
    this.state = {score: 0, showModal: false}
  }

  clearRedrawInterval () {
    if (this.reDrawInterval) {
      clearInterval(this.reDrawInterval)
    }
  }

  endGame () {
    this.clearRedrawInterval()
    this.openModal()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.AIPlayer && nextProps.simulating && _size(nextProps.aiSimulatorMoves)) {
      this.game = new TetrisGame(3, nextProps.AIPlayer)
      this.playAIGame(0, nextProps.aiSimulatorMoves)
    }
  }

  playAIGame (currentMove = 0, aiSimulatorMoves) {
    const {playAIGame} = this

    if (currentMove > _size(aiSimulatorMoves) - 1) {
      return this.props.finishGame()
    }

    this.game.AIAdvanceGame(aiSimulatorMoves[currentMove])
    this.reDraw()

    setTimeout(function () { playAIGame(currentMove + 1, aiSimulatorMoves) }, this.props.drawSpeed)
  }

  startNewGame (difficulty) {
    let frameRate = 10

    switch (difficulty) {
      case 'easy':
        frameRate = 10
        break
      case 'medium':
        frameRate = 5
        break
      case 'hard':
        frameRate = 2
        break
    }

    this.clearRedrawInterval()

    this.game = new TetrisGame(frameRate)

    this.reDrawInterval = setInterval(this.reDraw, 60)
  }

  changeTetrisBg (color, gameAreaBorderColor) {
    tetrisCanvasAttributes.backgroundColor = color
    tetrisCanvasAttributes.gameAreaBorderColor = gameAreaBorderColor
  }

  closeModal () {
    this.setState({showModal: false})
  }

  drawGameElements () {
    const {ctx} = this

    const gameBoard = this.game.getBoard()
    const currentBlock = this.game.getCurrentBlock()

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        if (gameBoard[i][j]) {
          ctx.beginPath()
          ctx.rect(
            tetrisCanvasAttributes.widthOffset * i,
            tetrisCanvasAttributes.heightOffset * j,
            tetrisCanvasAttributes.widthOffset,
            tetrisCanvasAttributes.heightOffset
          )
          ctx.fillStyle = games.tetris.blockTypeColors[gameBoard[i][j].type]
          ctx.fill()
        }
      }
    }

    for (let i = 0; i < _size(currentBlock.occupiedPositions); i++) {
      ctx.beginPath()
      ctx.rect(
        tetrisCanvasAttributes.widthOffset * currentBlock.occupiedPositions[i].x,
        tetrisCanvasAttributes.heightOffset * currentBlock.occupiedPositions[i].y,
        tetrisCanvasAttributes.widthOffset,
        tetrisCanvasAttributes.heightOffset
      )
      ctx.fillStyle = games.tetris.blockTypeColors[currentBlock.type]
      ctx.fill()
    }

    this.setState({
      score: this.game.getScore(),
      numMoves: this.game.getMoveCount()
    })
  }

  drawBorderForGameArea () {
    const {ctx} = this

    ctx.strokeStyle = tetrisCanvasAttributes.gameAreaBorderColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, tetrisCanvasAttributes.gameAreaHeight)
    ctx.lineTo(tetrisCanvasAttributes.gameAreaWidth, tetrisCanvasAttributes.gameAreaHeight)
    ctx.lineTo(tetrisCanvasAttributes.gameAreaWidth, 0)
    ctx.closePath()
    ctx.stroke()
  }

  drawTextAtLocation (text, x, y) {
    const {ctx} = this

    ctx.font = '30px Arial'
    ctx.fillStyle = tetrisCanvasAttributes.gameAreaBorderColor
    ctx.fillText(text, x, y)
  }

  drawNextElement () {
    const {ctx} = this
    const nextElement = this.game.getNextBlock()
    let lineWidth = 2

    ctx.beginPath()
    for (let i = 0; i < _size(nextElement.occupiedPositions); i++) {
      ctx.rect(
        nextElementAreaConstants.xStart + tetrisCanvasAttributes.widthOffset * ((nextElement.occupiedPositions[i].x - 2)),
        nextElementAreaConstants.yStart + tetrisCanvasAttributes.heightOffset * (nextElement.occupiedPositions[i].y),
        tetrisCanvasAttributes.widthOffset,
        tetrisCanvasAttributes.heightOffset
      )
      ctx.fillStyle = games.tetris.blockTypeColors[nextElement.type]
      ctx.fill()
    }

    ctx.beginPath()
    ctx.strokeStyle = tetrisCanvasAttributes.backgroundColor
    ctx.lineWidth = lineWidth

    for (let i = 0; i < 4; i++) {
      ctx.moveTo(nextElementAreaConstants.xStart + tetrisCanvasAttributes.widthOffset * i, nextElementAreaConstants.yStart)
      ctx.lineTo(nextElementAreaConstants.xStart + tetrisCanvasAttributes.widthOffset * i, nextElementAreaConstants.yEnd)
      ctx.stroke()
    }

    for (let i = 0; i < 4; i++) {
      ctx.moveTo(nextElementAreaConstants.xStart, nextElementAreaConstants.yStart + i * tetrisCanvasAttributes.heightOffset)
      ctx.lineTo(nextElementAreaConstants.xEnd, nextElementAreaConstants.yStart + i * tetrisCanvasAttributes.heightOffset)
      ctx.stroke()
    }

    this.drawTextAtLocation('Next Block', nextElementAreaConstants.xStart, nextElementAreaConstants.yStart - 30)
  }

  drawScore () {
    const {score} = this.state

    this.drawTextAtLocation(`Score: ${score}`, nextElementAreaConstants.xStart, tetrisCanvasAttributes.heightOffset * 10)
  }

  reDraw () {
    const {ctx} = this

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = tetrisCanvasAttributes.backgroundColor
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    if (!this.props.AIPlayer) {
      this.game.advanceGame()
    }
    this.drawGameElements()
    this.drawGrid()
    this.drawBorderForGameArea()
    this.drawNextElement()
    this.drawScore()

    if (this.game.isGameOver()) {
      return this.endGame()
    }
  }

  drawGrid () {
    const {ctx} = this

    ctx.lineWidth = 0.2
    ctx.strokeStyle = tetrisCanvasAttributes.backgroundColor

    for (let i = 0; i <= 20; i++) {
      let currentHeight = tetrisCanvasAttributes.heightOffset * i

      ctx.beginPath()
      ctx.moveTo(0, currentHeight)
      ctx.lineTo(tetrisCanvasAttributes.width, currentHeight)
      ctx.stroke()
    }

    for (let i = 0; i <= 10; i++) {
      let currentWidth = tetrisCanvasAttributes.widthOffset * i

      ctx.beginPath()
      ctx.moveTo(currentWidth, 0)
      ctx.lineTo(currentWidth, tetrisCanvasAttributes.height)
      ctx.stroke()
    }
  }

  draw (ctx) {
    this.ctx = ctx
  }

  openModal () {
    this.setState({showModal: true})
  }

  render () {
    return (
      <section className='tetris-controls'>
        <div>
          <button onClick={() => this.changeTetrisBg('#FFF', '#363636')}>
            White
          </button>
          <button onClick={() => this.changeTetrisBg('#D9D9D9', '#333')}>
            Gray
          </button>
          <button onClick={() => this.changeTetrisBg('#363636', '#FFF')}>
            Black
          </button>
        </div>

        {!this.props.AIPlayer &&
          <div>
            <button onClick={() => this.startNewGame('easy')}>
              Easy
            </button>
            <button onClick={() => this.startNewGame('medium')}>
              Medium
            </button>
            <button onClick={() => this.startNewGame('hard')}>
              Hard
            </button>
          </div>
        }
        <Canvas
          customClass='tetris-canvas'
          style={{'background': tetrisCanvasAttributes.backgroundColor}}
          draw={this.draw}
          attributes={tetrisCanvasAttributes}
        />
        {!this.props.AIPlayer && this.state.showModal && <Modal closeFn={this.closeModal}>
          <section>
            <h2>Game Over</h2>
            <p>Thank you for playing!</p>
            <p>Your final score is <b>{this.state.score}</b></p>
            <p>Total number of moves: <b>{this.state.numMoves}</b></p>
          </section>
        </Modal>}
      </section>
    )
  }
}

DrawComponent.PropTypes = {
  AIPlayer: PropTypes.bool,
  drawSpeed: PropTypes.number,
  aiSimulatorMoves: PropTypes.object,
  finishGame: PropTypes.func,
  simulating: PropTypes.bool
}

export default DrawComponent
