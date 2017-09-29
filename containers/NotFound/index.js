import {Component, h} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

export default class NotFound extends Component {
  render () {
    return (
      <div className='error-404'>
        <h1>404</h1>
        <p>
          Congratulations! <br /><br />
          You discovered the 404 Page.<br />
          This means that something is either broken on the site or you mistyped the url.<br />
          <Link href='/'>Use this link here to go to the homepage</Link>
        </p>

      </div>
    )
  }
}
