import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import DrawComponent from './drawComponent'
import Info from './info'
import {breadthFirstSearch} from 'algorithms'
import {generateTreeWithData} from 'helpers'

export default class BreadthSearch extends Component {
  constructor (props) {
    super(props)

    this.updatePage = this.updatePage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.generateTree = this.generateTree.bind(this)
    this.state = {
      searchValue: 5,
      show: 'all',
      tree: generateTreeWithData(1, 'number', [5]),
      treeDepth: 1
    }
  }

  componentWillMount () {
    const {searchValue} = this.state
    console.log(breadthFirstSearch(this.state.tree.root, function (node) {
      return (node.data === searchValue)
    }))
  }

  generateTree () {
    const {treeDepth, searchValue} = this.state
    const tree = generateTreeWithData(treeDepth, 'number', [searchValue])

    this.setState({tree})
  }

  updateState (type, val) {
    this.setState({[type]: _.toInteger(val)})
  }

  updatePage (show) {
    this.setState({show})
  }

  render () {
    const drawComponentAttributes = {
      generateTree: this.generateTree,
      updateState: this.updateState,
      tree: this.state.tree
    }

    return (
      <article className='top-holder'>
        <header>
          <h1>Breadth Search</h1>
          <section>
            <span>Content</span>
            <ol className='content-list'>
              <li><a href='#info'>Info</a></li>
              <li><a href='#tree'>Tree</a></li>
            </ol>
          </section>
        </header>
        <Info />
        <DrawComponent {...drawComponentAttributes} />
      </article>
    )
  }
}
