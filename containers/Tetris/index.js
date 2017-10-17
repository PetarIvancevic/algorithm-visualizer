import {h, Component} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

import Canvas from 'components/Canvas'
import Info from './info'
import DrawComponent from './drawComponent'

export default class Tetris extends Component {
  render () {
    return (
      <article className='top-holder'>
        <header>
          <h1>Tetris</h1>
        </header>
        <Info />
        <DrawComponent />
      </article>
    )
  }
}
