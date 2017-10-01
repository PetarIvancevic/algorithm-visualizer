import {Component, h} from 'preact' //eslint-disable-line

import Dynamic from './dynamic'
import Info from './info'
import {breadthSearch} from 'algorithms'
import {generateTreeWithData} from 'helpers'

export default class BreadthSearch extends Component {
  constructor (props) {
    super(props)

    this.updatePage = this.updatePage.bind(this)
    this.state = {
      show: 'all',
      tree: generateTreeWithData(3, 'number', [5, 15, 25])
    }
  }

  updatePage (show) {
    this.setState({show})
  }

  componentWillMount () {
    console.log(breadthSearch(this.state.tree.root, function (node) {
      return (node.data === 25)
    }))
  }

  showSections () {
    const {show} = this.state

    if (show === 'info') {
      return <Info />
    }

    if (show === 'dynamic') {
      return <Dynamic tree={this.state.tree} />
    }

    return [<Info />, <Dynamic tree={this.state.tree} />]
  }

  render () {
    return (
      <article className='top-holder'>
        <header>
          <h1>Breadth Search</h1>
          <ul>
            <li onClick={() => this.updatePage('all')}>All</li>
            <li onClick={() => this.updatePage('info')}>Info</li>
            <li onClick={() => this.updatePage('dynamic')}>Dynamic</li>
          </ul>
        </header>
        {this.showSections()}
      </article>
    )
  }
}
