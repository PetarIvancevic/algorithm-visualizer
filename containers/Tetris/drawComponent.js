// import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'
import TetrisGame from 'games/tetris/index'
import {games} from 'constants'

const tetrisCanvasAttributes = {
  height: 600,
  width: 400,
  heightOffset: 600 / 20,
  widthOffset: 400 / 10
}

export default class DrawComponent extends Component {
  constructor () {
    super()

    this.draw = this.draw.bind(this)
    this.drawGameElements = this.drawGameElements.bind(this)
    this.drawGrid = this.drawGrid.bind(this)
    this.reDraw = this.reDraw.bind(this)
  }

  componentDidMount () {
    this.game = new TetrisGame(this.reDraw)
  }

  drawGameElements () {
    const gameBoard = this.game.getBoard()

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        if (gameBoard[i][j]) {
          this.ctx.rect(
            tetrisCanvasAttributes.widthOffset * i,
            tetrisCanvasAttributes.heightOffset * j,
            tetrisCanvasAttributes.widthOffset,
            tetrisCanvasAttributes.heightOffset
          )
          this.ctx.fillStyle = games.tetris.blockTypeColors[gameBoard[i][j].type]
          this.ctx.fill()
        }
      }
    }
  }

  reDraw () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.drawGameElements()
    this.drawGrid()
  }

  drawGrid () {
    this.ctx.lineWidth = 0.2
    this.ctx.strokeStyle = '#ECECED'

    for (let i = 0; i <= 20; i++) {
      let currentHeight = tetrisCanvasAttributes.heightOffset * i

      this.ctx.moveTo(0, currentHeight)
      this.ctx.lineTo(tetrisCanvasAttributes.width, currentHeight)
      this.ctx.stroke()
    }

    for (let i = 0; i <= 10; i++) {
      let currentWidth = tetrisCanvasAttributes.widthOffset * i

      this.ctx.moveTo(currentWidth, 0)
      this.ctx.lineTo(currentWidth, tetrisCanvasAttributes.height)
      this.ctx.stroke()
    }
  }

  draw (ctx) {
    this.ctx = ctx
    this.drawGrid()
  }

  render () {
    return (
      <Canvas
        customClass='tetris-canvas'
        draw={this.draw}
        attributes={tetrisCanvasAttributes}
      />
    )
  }
}
