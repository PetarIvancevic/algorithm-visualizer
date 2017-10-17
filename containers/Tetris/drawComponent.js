// import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'

const tetrisCanvasAttributes = {
  height: 600,
  width: 400
}

export default class DrawComponent extends Component {
  constructor () {
    super()

    this.draw = this.draw.bind(this)
  }

  drawGrid (ctx) {
    const heightOffset = tetrisCanvasAttributes.height / 20
    const widthOffset = tetrisCanvasAttributes.width / 10

    ctx.lineWidth = 0.2
    ctx.strokeStyle = '#ECECED'

    for (let i = 0; i <= 20; i++) {
      let currentHeight = heightOffset * i

      ctx.moveTo(0, currentHeight)
      ctx.lineTo(tetrisCanvasAttributes.width, currentHeight)
      ctx.stroke()
    }

    for (let i = 0; i <= 10; i++) {
      let currentWidth = widthOffset * i

      ctx.moveTo(currentWidth, 0)
      ctx.lineTo(currentWidth, tetrisCanvasAttributes.height)
      ctx.stroke()
    }
  }

  draw (ctx) {
    this.drawGrid(ctx)
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
