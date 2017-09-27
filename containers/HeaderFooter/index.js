import {Component, h} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

export default class Home extends Component {
  render () {
    return (
      <div>
        <header>
          <h1>Algorithms</h1>
          <nav>
            <Link href='/algorithm/breadth-search'>Breadth search</Link>
          </nav>
        </header>

        {this.props.children}

        <footer>
          <p>Footer...</p>
        </footer>
      </div>
    )
  }
}
