import {h, Component} from 'preact' //eslint-disable-line

import Info from './info'
import DrawComponent from './drawComponent'
import AI from 'games/tetris/ai'

export default class Tetris extends Component {
  render () {
    return (
      <article className='top-holder'>
        <header>
          <h1>Tetris</h1>
        </header>
        <button onClick={AI.train}>
          Train
        </button>
        <Info />
        <DrawComponent />
      </article>
    )
  }
}
