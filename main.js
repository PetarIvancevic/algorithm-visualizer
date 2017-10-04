import {h, render} from 'preact' //eslint-disable-line
import Router from 'preact-router'

import BreadthFirstSearch from 'containers/BreadthFirstSearch'
import HeaderFooter from 'containers/HeaderFooter'
import Home from 'containers/Home'
import NotFound from 'containers/NotFound'

const App = () => (
  <HeaderFooter>
    <Router>
      <Home path='/' />
      <BreadthFirstSearch path='algorithm/breadth-first-search' />
      <NotFound default />
    </Router>
  </HeaderFooter>
)

render(<App />, document.body)
