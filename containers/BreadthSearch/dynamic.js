import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'

const drawingConstants = {
  bottomMaxWidth: 0,
  minSpacing: 15,
  radius: 17
}

export default class Dynamic extends Component {
  constructor () {
    super()

    this.draw = this.draw.bind(this)
    this.getNodeXCoord = this.getNodeXCoord.bind(this)
    this.getNodeSpacingAtDepth = this.getNodeSpacingAtDepth.bind(this)
  }

  getNodeSpacingAtDepth (depth, adjustedMaxWidth) {
    const maxWidthAtDepth = adjustedMaxWidth - (2 * drawingConstants.radius * this.getNodeCountAtDepth(depth))
    const numSpaces = (this.getNodeCountAtDepth(depth) - 1)

    return maxWidthAtDepth / numSpaces
  }

  getNodeCountAtDepth (depth) {
    return Math.pow(2, depth)
  }

  getNodeXCoord (depth, currentNodeAtDepth) {
    const {tree} = this.props
    const treeCenter = (drawingConstants.bottomMaxWidth / 2) + 50
    const depthHalfNumNodes = this.getNodeCountAtDepth(depth) / 2
    const adjustedMaxWidth = drawingConstants.bottomMaxWidth - (tree.depth - depth) * (Math.pow(2, tree.depth - depth) * drawingConstants.radius + drawingConstants.radius)
    const spacing = this.getNodeSpacingAtDepth(depth, adjustedMaxWidth)
    let positionHelper = -1

    if (currentNodeAtDepth >= depthHalfNumNodes) {
      positionHelper = 1
    }

    const spacingHelper = Math.abs((spacing * depthHalfNumNodes) - (spacing * currentNodeAtDepth) - (spacing / 2))
    const nodeHelper = Math.abs((2 * drawingConstants.radius * depthHalfNumNodes) - (2 * drawingConstants.radius * currentNodeAtDepth) - drawingConstants.radius)

    return treeCenter + (positionHelper * (spacingHelper + nodeHelper))
  }

  drawChildArrow (ctx, centerCoords, childNode, depth, nodeIndexAtDepth) {
    if (childNode) {
      ctx.moveTo(centerCoords.x, centerCoords.y)
      ctx.lineTo(
        this.getNodeXCoord(depth, nodeIndexAtDepth),
        centerCoords.y + 2 * drawingConstants.radius
      )
      ctx.stroke()
    }
  }

  drawNodesWithChildrenArrows (ctx, centerCoords, depth, treeNode, nodeIndexAtDepth) {
    ctx.beginPath()

    this.drawChildArrow(ctx, centerCoords, treeNode.children[0], depth + 1, 2 * nodeIndexAtDepth)
    this.drawChildArrow(ctx, centerCoords, treeNode.children[1], depth + 1, 2 * nodeIndexAtDepth + 1)

    ctx.beginPath()
    ctx.arc(centerCoords.x, centerCoords.y, drawingConstants.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#333'
    ctx.fillText(treeNode.data, centerCoords.x, centerCoords.y + 5)
  }

  draw (ctx) {
    const {tree} = this.props
    drawingConstants.bottomMaxWidth = 2 * drawingConstants.radius * this.getNodeCountAtDepth(tree.depth) + drawingConstants.minSpacing * (this.getNodeCountAtDepth(tree.depth) - 1)

    ctx.font = '9pt Calibri'
    ctx.textAlign = 'center'

    this.drawNodesWithChildrenArrows(ctx, {
      x: (drawingConstants.bottomMaxWidth / 2) + 50,
      y: drawingConstants.minSpacing * 2
    }, 0, tree.root, 0)

    let currentDepth = 1
    let numPrintedNodes = 0
    const that = this
    _.each(_.slice(tree.nodes, 1), function (treeNode) {
      if (numPrintedNodes > Math.pow(2, currentDepth) - 1) {
        numPrintedNodes = 0
        currentDepth++
      }

      that.drawNodesWithChildrenArrows(
        ctx, {
          x: that.getNodeXCoord(currentDepth, numPrintedNodes),
          y: (currentDepth * drawingConstants.radius * 2) + (drawingConstants.minSpacing * (currentDepth + 1) + 15)
        }, currentDepth, treeNode, numPrintedNodes)

      numPrintedNodes++
    })
  }

  render () {
    return (
      <section>
        <div>
          <span>Tree depth: </span>
          <input type='number' placeholder={1} onChange={e => this.props.updateState('treeDepth', e.target.value)} />
        </div>
        <div>
          <span>Search value: </span>
          <input type='number' placeholder={5} onChange={e => this.props.updateState('searchValue', e.target.value)} />
        </div>
        <div>
          <button onClick={this.props.generateTree}>Render</button>
        </div>
        <Canvas draw={this.draw} attributes={{height: this.props.tree.depth * 50 + 50, width: 800}} />
      </section>
    )
  }
}
