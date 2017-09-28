import _ from 'lodash'

export function breadthSearch (initialNode, solutionFn) {
  console.log('eeee', initialNode, solutionFn)
  let explored = []
  let frontier = [initialNode]

  while (true) {
    if (!_.size(frontier)) {
      return false
    }

    let node = frontier.shift()

    if (solutionFn(node)) {
      return node
    }

    explored.push(node)
    frontier = _.concat(frontier, node.children)
  }
}
