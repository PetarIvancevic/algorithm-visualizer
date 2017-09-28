import {Component, h} from 'preact' //eslint-disable-line

import {breadthSearch} from 'algorithms'
import {generateTreeWithData} from 'helpers'

export default class BreadthSearch extends Component {
  componentWillMount () {
    const tree = generateTreeWithData(5, 'number')
  }

  render () {
    return (
      <div>
        <h1>Breadth Search</h1>
      </div>
    )
  }
}
