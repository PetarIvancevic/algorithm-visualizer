import {h, render} from 'preact' //eslint-disable-line
import Router from 'preact-router'
import Match from 'preact-router/match'

import BreadthSearch from 'containers/BreadthSearch'
import HeaderFooter from 'containers/HeaderFooter'
import NotFound from 'containers/NotFound'

const App = () => (
  <HeaderFooter>
    <Router>
      <BreadthSearch path='algorithm/breadth-search' />
      <NotFound default />
    </Router>
  </HeaderFooter>
)

render(<App />, document.body)
