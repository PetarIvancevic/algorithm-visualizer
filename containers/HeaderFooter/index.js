import {Component, h} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

export default class Home extends Component {
  render () {
    return (
      <div>
        <header className='main-header'>
          <h1><Link href='/'>Algorithms</Link></h1>
        </header>

        {this.props.children}

        <footer className='main-footer'>
          <p>
            Petar Ivančević
          </p>
        </footer>
      </div>
    )
  }
}
