import _ from 'lodash'
import {Component, h} from 'preact' //eslint-disable-line

import DrawComponent from './drawComponent'
import Info from './info'
import {breadthFirstSearch} from 'algorithms'
import {generateTreeWithData} from 'helpers'

export default class BreadthSearch extends Component {
  constructor (props) {
    super(props)

    this.updateState = this.updateState.bind(this)
    this.generateTree = this.generateTree.bind(this)
    this.state = {
      searchValue: 5,
      showErrorModal: false,
      foundTreeNode: null,
      tree: generateTreeWithData(1, 'number', [5]),
      treeDepth: 1
    }
  }

  componentWillMount () {
    this.findValue(this.state.searchValue)
  }

  findValue (searchValue) {
    const foundTreeNode = breadthFirstSearch(this.state.tree.root, function (node) {
      return (node.data === searchValue)
    })

    if (foundTreeNode) {
      this.setState({foundTreeNode})
    }
  }

  generateTree () {
    const {treeDepth, searchValue} = this.state
    const tree = generateTreeWithData(treeDepth, 'number', [searchValue])

    if (!tree) {
      this.setState({showErrorModal: true})
    } else {
      this.setState({tree, showErrorModal: false})
    }

    this.findValue(searchValue)
  }

  updateState (type, val) {
    this.setState({[type]: _.toInteger(val)})
  }

  render () {
    const drawComponentAttributes = {
      foundTreeNode: this.state.foundTreeNode,
      generateTree: this.generateTree,
      tree: this.state.tree,
      updateState: this.updateState
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
