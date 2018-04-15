import {h, Component} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

import DrawComponent from './drawComponent'
import TetrisHeader from 'containers/Tetris/header'

export default class Tetris extends Component {
  render () {
    return (
      <article className='top-holder'>
        <TetrisHeader />
        <DrawComponent />
      </article>
    )
  }
}
