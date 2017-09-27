import {Component, h} from 'preact' //eslint-disable-line

export default class NotFound extends Component {
  render () {
    return (
      <div className='error-404'>
        <h1>404</h1>
        <p>
          Whoops...
        </p>
      </div>
    )
  }
}
