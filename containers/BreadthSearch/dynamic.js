import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'

const drawingConstants = {
  radius: 15,
  minSpacing: 15
}

export default class Dynamic extends Component {
  constructor () {
    super()

    this.draw = this.draw.bind(this)
    this.getNodeXCoord = this.getNodeXCoord.bind(this)
    this.getNodeSpacingAtDepth = this.getNodeSpacingAtDepth.bind(this)
  }

  getNodeSpacingAtDepth (bottomMaxWidth, depth) {
    const maxWidthAtDepth = bottomMaxWidth - (2 * drawingConstants.radius * this.getNodeCountAtDepth(depth))
    const numSpaces = (this.getNodeCountAtDepth(depth) - 1)

    return maxWidthAtDepth / numSpaces
  }

  getNodeCountAtDepth (depth) {
    return Math.pow(2, depth)
  }

  getNodeXCoord (bottomMaxWidth, depth, currentNodeAtDepth, maxTreeDepth) {
    const treeCenter = (bottomMaxWidth / 2) + 50
    const depthHalfNumNodes = this.getNodeCountAtDepth(depth) / 2
    const adjustedMaxWidth = bottomMaxWidth - (maxTreeDepth - depth) * Math.pow(2, maxTreeDepth - depth) * drawingConstants.radius
    const spacing = this.getNodeSpacingAtDepth(adjustedMaxWidth, depth)
    let positionHelper = -1

    if (currentNodeAtDepth >= depthHalfNumNodes) {
      positionHelper = 1
    }

    const spacingHelper = Math.abs((spacing * depthHalfNumNodes) - (spacing * currentNodeAtDepth) - (spacing / 2))
    const nodeHelper = Math.abs((2 * drawingConstants.radius * depthHalfNumNodes) - (2 * drawingConstants.radius * currentNodeAtDepth) - drawingConstants.radius)

    return treeCenter + (positionHelper * (spacingHelper + nodeHelper))
  }

  drawNodesWithChilddrenArrows (ctx, centerCoords, data) {
    ctx.beginPath()
    ctx.arc(centerCoords.x, centerCoords.y, drawingConstants.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#333'
    ctx.fillText(data, centerCoords.x, centerCoords.y + 5)
  }

  draw (ctx) {
    const {tree} = this.props
    const bottomMaxWidth = 2 * drawingConstants.radius * this.getNodeCountAtDepth(tree.depth) + drawingConstants.minSpacing * (this.getNodeCountAtDepth(tree.depth) - 1)

    ctx.font = '9pt Calibri'
    ctx.textAlign = 'center'

    this.drawNodesWithChilddrenArrows(ctx, {
      x: (bottomMaxWidth / 2) + 50,
      y: drawingConstants.minSpacing * 2
    }, tree.root.data)

    let currentDepth = 1
    let numPrintedNodes = 0
    const that = this
    _.each(_.slice(tree.nodes, 1), function (treeNode, index) {
      if (numPrintedNodes > Math.pow(2, currentDepth) - 1) {
        numPrintedNodes = 0
        currentDepth++
      }

      that.drawNodesWithChilddrenArrows(
        ctx, {
          x: that.getNodeXCoord(bottomMaxWidth, currentDepth, numPrintedNodes, tree.depth),
          y: (currentDepth * drawingConstants.radius * 2) + (drawingConstants.minSpacing * (currentDepth + 1) + 15)
        }, treeNode.data)

      numPrintedNodes++
    })
  }

  render () {
    return (
      <section>
        <div>
          <span>Tree depth: </span>
          <input type='number' />
        </div>
        <div>
          <span>Search value: </span>
          <input type='number' />
        </div>
        <div>
          <button>Search</button>
        </div>
        <Canvas draw={this.draw} attributes={{height: '500', width: '800'}} />
      </section>
    )
  }
}
