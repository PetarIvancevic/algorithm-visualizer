import {h, Component} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

export default class Home extends Component {
  render () {
    return (
      <div>
        <nav>
          <Link href='/algorithm/breadth-search'>Breadth search</Link>
        </nav>
      </div>
    )
  }
}
