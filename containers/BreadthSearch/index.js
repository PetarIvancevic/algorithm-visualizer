import {Component, h} from 'preact' //eslint-disable-line

import {breadthSearch} from 'algorithms'
import {generateTreeWithData} from 'helpers'

export default class BreadthSearch extends Component {
  componentWillMount () {
    const tree = generateTreeWithData(10, 'number', [5, 15, 25])

    console.log(breadthSearch(tree.root, function (node) {
      return (node.data === 25)
    }))
  }

  render () {
    return (
      <div>
        <h1>Breadth Search</h1>

      </div>
    )
  }
}
