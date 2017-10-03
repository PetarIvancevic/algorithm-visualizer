import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'
import {canvasNodeProperties} from 'constants'

const drawingConstants = {
  bottomMaxWidth: 0,
  connectionLineWidth: 5,
  fontSize: 9,
  leftOffset: 50,
  minSpacing: 15,
  radius: 25
}

export default class DrawComponent extends Component {
  constructor () {
    super()

    this.draw = this.draw.bind(this)
    this.getNodeXCoord = this.getNodeXCoord.bind(this)
  }

  getNodeCountAtDepth (depth) {
    return Math.pow(2, depth)
  }

  getNodeXCoord (depth, currentNodeAtDepth) {
    const {tree} = this.props
    let widthHelper = drawingConstants.bottomMaxWidth / this.getNodeCountAtDepth(depth + 1)

    if (depth === 0) {
      return drawingConstants.leftOffset + widthHelper
    } else if (depth !== tree.depth) {
      return drawingConstants.leftOffset + widthHelper + 2 * currentNodeAtDepth * widthHelper
    } else {
      return drawingConstants.leftOffset + ((currentNodeAtDepth + 1) * 2 * drawingConstants.radius) + (currentNodeAtDepth * drawingConstants.minSpacing) - drawingConstants.radius
    }
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
    ctx.strokeStyle = canvasNodeProperties.connectionLineColor
    ctx.lineWidth = drawingConstants.connectionLineWidth
    this.drawChildArrow(ctx, centerCoords, treeNode.children[0], depth + 1, 2 * nodeIndexAtDepth)
    this.drawChildArrow(ctx, centerCoords, treeNode.children[1], depth + 1, 2 * nodeIndexAtDepth + 1)

    ctx.beginPath()
    ctx.arc(centerCoords.x, centerCoords.y, drawingConstants.radius, 0, Math.PI * 2)
    ctx.fillStyle = canvasNodeProperties.bgColor
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = canvasNodeProperties.textColor
    ctx.fillText(treeNode.data, centerCoords.x, centerCoords.y + 5)
  }

  draw (ctx) {
    const {tree} = this.props
    drawingConstants.bottomMaxWidth = 2 * drawingConstants.radius * this.getNodeCountAtDepth(tree.depth) + drawingConstants.minSpacing * (this.getNodeCountAtDepth(tree.depth) - 1)

    ctx.font = `${drawingConstants.fontSize}pt Calibri`
    ctx.textAlign = 'center'

    this.drawNodesWithChildrenArrows(ctx, {
      x: this.getNodeXCoord(0, 0),
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

      that.drawNodesWithChildrenArrows(ctx, {
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
        <Canvas draw={this.draw} attributes={{height: this.props.tree.depth * 70 + 60, width: 900}} />
      </section>
    )
  }
}
