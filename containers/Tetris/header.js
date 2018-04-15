import {h, Component} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

export default class TetrisNav extends Component {
  render () {
    return (
      <header>
        <h1>Tetris</h1>
        <nav>
          <ul>
            <li><Link href='/game/tetris/train'>Train</Link></li>
            <li><Link href='/game/tetris'>Game</Link></li>
          </ul>
        </nav>
      </header>
    )
  }
}
