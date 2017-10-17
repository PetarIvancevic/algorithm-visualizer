import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'
import {canvasNodeProperties} from 'constants'

export default class DrawComponent extends Component {
  draw (ctx) {
    // draw grey grid
  }

  render () {
    const attributes = {
      height: 600,
      width: 500
    }

    return (
      <Canvas
        customClass='tetris-canvas'
        draw={this.draw}
        attributes={attributes}
      />
    )
  }
}
