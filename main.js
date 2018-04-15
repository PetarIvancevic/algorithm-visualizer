import {h, render} from 'preact' //eslint-disable-line
import Router from 'preact-router'

import BreadthFirstSearch from 'containers/BreadthFirstSearch'
import HeaderFooter from 'containers/HeaderFooter'
import Home from 'containers/Home'
import Tetris from 'containers/Tetris'
import TetrisAITrain from 'containers/Tetris/train'
import NotFound from 'containers/NotFound'

const App = () => (
  <HeaderFooter>
    <Router>
      <Home path='/' />
      <BreadthFirstSearch path='algorithm/breadth-first-search' />
      <Tetris path='game/tetris' />
      <TetrisAITrain path='game/tetris/train' />
      <NotFound default />
    </Router>
  </HeaderFooter>
)

render(<App />, document.body)
