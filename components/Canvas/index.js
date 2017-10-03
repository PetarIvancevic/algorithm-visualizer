import {Component, h} from 'preact' //eslint-disable-line
import PropTypes from 'prop-types'

class Canvas extends Component {
  constructor () {
    super()

    this.initCanvasCtx = this.initCanvasCtx.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.attributes.height !== this.props.attributes.height) {
      this.props.draw(this.canvasCtx)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.props.draw(this.canvasCtx)
  }

  componentDidMount () {
    this.props.draw(this.canvasCtx)
  }

  initCanvasCtx (canvasEl) {
    if (canvasEl) {
      this.canvasCtx = canvasEl.getContext('2d')
    }
  }

  render () {
    return (
      <section>
        <canvas ref={this.initCanvasCtx} {...this.props.attributes}>
          Your browser does not support the canvas element
        </canvas>
      </section>
    )
  }
}

Canvas.propTypes = {
  draw: PropTypes.func.isRequired
}

export default Canvas