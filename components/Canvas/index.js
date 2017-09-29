import {Component, h} from 'preact' //eslint-disable-line

export default class Canvas extends Component {
  render () {
    return (
      <section>
        <canvas id='canvas' {...this.props.attributes}>
          Your browser does not support the canvas element
        </canvas>
      </section>
    )
  }
}
