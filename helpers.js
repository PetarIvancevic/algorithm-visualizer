import _ from 'lodash'
import rjs from 'random-js'

const rjsEngine = rjs.engines.browserCrypto

function sumUp (num) {
  return (num * (num + 1)) / 2
}

function CreateTree (data, depth) {
  this.depth = 0
  this.nodes = [data]

  this.pushNode = function (childData, parent, leftRight) {
    // left child will be 2n + 1
    // right child will be 2n + 2
    const helper = leftRight === 'left' ? 1 : 2
    const child = new CreateTreeNode(childData, parent)

    parent.children[helper - 1] = child
    this.nodes.push(child)
  }
}

export function generateTreeWithData (depth = 0, dataType) {
  if (depth > 23) {
    alert('Please contact the dev for depth over 23!', depth)
    return
  }

  const tree = new CreateTree(new CreateTreeNode(randomOfType(dataType)), depth)

  for (let i = 0; i < depth; i++) {
    // i^2 - 1  => first element at depth "i"
    // i^2      => number of elements at depth "i"
    let startIndex = Math.pow(2, i)
    let parents = _.slice(tree.nodes, startIndex - 1, (2 * startIndex) - 1)

    for (let j = 0; j < _.size(parents); j++) {
      tree.pushNode(randomOfType(dataType), parents[j], 'left')
      tree.pushNode(randomOfType(dataType), parents[j], 'right')
    }

    tree.depth++
  }

  return tree
}

export function CreateTreeNode (data, parent) {
  this.data = data
  this.parent = parent
  this.children = []
}

function randomOfType (types) {
  switch (types)  {
    case 'number':
      return rjs.integer(0, 9000)(rjsEngine)
    case 'string':
      return rjs.string()(rjsEngine, 10)
    default:
      throw 'Invalid types'
  }
}
