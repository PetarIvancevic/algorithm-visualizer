import _ from 'lodash'
import rjs from 'random-js'

import {errorOut} from 'errors'

const rjsEngine = rjs.engines.browserCrypto

function CreateTree (data, depth) {
  this.root = data
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

export function generateTreeWithData (depth = 0, dataType, includeDataArray = []) {
  if (depth > 17) {
    global.alert('Please contact the dev for depth over 17!', depth)
    errorOut('You went to far')
  }

  const tree = new CreateTree(new CreateTreeNode(randomOfType(dataType)), depth)

  for (let i = 0; i < depth; i++) {
    // i^2 - 1  => first element at depth "i"
    // i^2      => number of elements at depth "i"
    let startIndex = Math.pow(2, i)
    let parents = _.slice(tree.nodes, startIndex - 1, (2 * startIndex) - 1)

    _.each(parents, function (parent) {
      tree.pushNode(randomOfType(dataType), parent, 'left')
      tree.pushNode(randomOfType(dataType), parent, 'right')
    })

    tree.depth++
  }

  _.each(includeDataArray, function (includedData) {
    const rand = _.random(0, _.size(tree.nodes) - 1)

    tree.nodes[rand].data = includedData
  })

  return tree
}

export function CreateTreeNode (data, parent) {
  this.data = data
  this.parent = parent
  this.children = []
}

function randomOfType (types) {
  switch (types) {
    case 'number':
      return rjs.integer(0, 9000)(rjsEngine)
    case 'string':
      return rjs.string()(rjsEngine, 10)
    default:
      errorOut('Invalid types')
  }
}
