import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'
import {canvasNodeProperties} from 'constants'

const drawingConstants = {
  bottomMaxWidth: 0,
  connectionLineWidth: 5,
  fontSize: 12,
  leftOffset: 50,
  minSpacing: 15,
  radius: 25
}

export default class DrawComponent extends Component {
  constructor () {
    super()

    this.draw = this.draw.bind(this)
    this.getNodeXCoord = this.getNodeXCoord.bind(this)
    this.setCanvasScale = this.setCanvasScale.bind(this)
    this.mainDrawFn = this.mainDrawFn.bind(this)
    this.drawSearchColors = this.drawSearchColors.bind(this)
    this.resetMarkedNodes = this.resetMarkedNodes.bind(this)
    this.startSearching = this.startSearching.bind(this)
    this.stopSearching = this.stopSearching.bind(this)
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

  drawChildArrow (centerCoords, childNode, depth, nodeIndexAtDepth) {
    const {ctx} = this

    if (childNode) {
      ctx.moveTo(centerCoords.x, centerCoords.y)
      ctx.lineTo(
        this.getNodeXCoord(depth, nodeIndexAtDepth),
        centerCoords.y + 2 * drawingConstants.radius
      )
      ctx.stroke()
    }
  }

  resetMarkedNodes () {
    const {tree} = this.props

    _.each(tree.nodes, function (treeNode) {
      treeNode.toggleHelperMarker(false)
    })
  }

  drawSearchColors (iterator) {
    const {tree, foundTreeNode} = this.props
    const {drawSearchColors} = this

    if (iterator === 0) {
      this.resetMarkedNodes()
    }

    if (iterator === _.size(tree.nodes) || !this.isSearching) {
      return
    }

    tree.nodes[iterator].toggleHelperMarker(true)
    this.mainDrawFn()

    if (foundTreeNode.id === tree.nodes[iterator].id) {
      return
    }

    this.searchTimeout = setTimeout(function () {
      drawSearchColors(iterator + 1)
    }, 500)
  }

  drawNodesWithChildrenArrows (centerCoords, depth, treeNode, nodeIndexAtDepth) {
    const {ctx} = this

    let strokeStyle, nodeBgColor, textColor

    if (treeNode.isNodeMarked()) {
      strokeStyle = canvasNodeProperties.markedBgColor
      nodeBgColor = canvasNodeProperties.markedBgColor
      textColor = canvasNodeProperties.markedTextColor
    } else {
      strokeStyle = canvasNodeProperties.connectionLineColor
      nodeBgColor = canvasNodeProperties.bgColor
      textColor = canvasNodeProperties.textColor
    }

    ctx.beginPath()
    ctx.strokeStyle = canvasNodeProperties.connectionLineColor
    ctx.lineWidth = drawingConstants.connectionLineWidth
    this.drawChildArrow(centerCoords, treeNode.children[0], depth + 1, 2 * nodeIndexAtDepth)
    this.drawChildArrow(centerCoords, treeNode.children[1], depth + 1, 2 * nodeIndexAtDepth + 1)

    ctx.beginPath()
    ctx.strokeStyle = strokeStyle
    ctx.arc(centerCoords.x, centerCoords.y, drawingConstants.radius, 0, Math.PI * 2)

    ctx.fillStyle = nodeBgColor

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = textColor
    ctx.fillText(treeNode.data, centerCoords.x, centerCoords.y + 5)
  }

  setCanvasScale () {
    const {ctx} = this
    const treeDepth = this.props.tree.depth

    if (treeDepth === 4) {
      return ctx.scale(0.65, 1)
    }
  }

  startSearching () {
    this.isSearching = true
  }

  stopSearching () {
    clearTimeout(this.searchTimeout)
    this.isSearching = false
  }

  mainDrawFn () {
    const {ctx} = this
    const {tree} = this.props

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, 700, tree.depth * 70 + 60)
    this.setCanvasScale()
    drawingConstants.bottomMaxWidth = 2 * drawingConstants.radius * this.getNodeCountAtDepth(tree.depth) + drawingConstants.minSpacing * (this.getNodeCountAtDepth(tree.depth) - 1)

    ctx.font = `${drawingConstants.fontSize}pt Calibri`
    ctx.textAlign = 'center'

    this.drawNodesWithChildrenArrows({
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

      that.drawNodesWithChildrenArrows({
        x: that.getNodeXCoord(currentDepth, numPrintedNodes),
        y: (currentDepth * drawingConstants.radius * 2) + (drawingConstants.minSpacing * (currentDepth + 1) + 15)
      }, currentDepth, treeNode, numPrintedNodes)

      numPrintedNodes++
    })
  }

  draw (ctx) {
    this.ctx = ctx
    this.mainDrawFn()
  }

  render () {
    const {drawSearchColors, startSearching, stopSearching} = this
    const {generateTree} = this.props

    return (
      <section>
        <header>
          <h2 id='tree'>Tree</h2>
        </header>
        <div className='canvas-tree-controls'>
          <label>
            <span>Tree depth:</span>
            <input type='number' placeholder={1} onChange={e => this.props.updateState('treeDepth', e.target.value)} min={0} max={4} />
          </label>
          <label>
            <span>Search value: </span>
            <input type='number' placeholder={5} onChange={e => this.props.updateState('searchValue', e.target.value)} />
          </label>
          <div>
            <button onClick={function () {
              stopSearching()
              generateTree()
            }}>Render</button>
          </div>
          <div>
            <button onClick={function () {
              startSearching()
              drawSearchColors(0)
            }}>Search Draw</button>
          </div>
        </div>
        <Canvas draw={this.draw} attributes={{height: this.props.tree.depth * 70 + 60, width: 700}} />
      </section>
    )
  }
}
