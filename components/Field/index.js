import {h, Component} from 'preact' //eslint-disable-line

export default class Field extends Component {
  render () {
    const {label, inputProperties} = this.props

    return (
      <div>
        <label>{this.props.label}</label>
        <input {...inputProperties} />
      </div>
    )
  }
}
