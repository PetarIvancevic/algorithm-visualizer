import {h, render} from 'preact' //eslint-disable-line
import Router from 'preact-router'

import BreadthSearch from 'containers/BreadthSearch'
import HeaderFooter from 'containers/HeaderFooter'
import Home from 'containers/Home'
import NotFound from 'containers/NotFound'

const App = () => (
  <HeaderFooter>
    <Router>
      <Home path='/' />
      <BreadthSearch path='algorithm/breadth-search' />
      <NotFound default />
    </Router>
  </HeaderFooter>
)

render(<App />, document.body)
