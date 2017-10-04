import {h} from 'preact' //eslint-disable-line

export default function Info () {
  return (
    <div>
      <section>
        <p>
          <b>Breadth first search (BFS)</b> is an algorithm used for searching <b>graph</b> or <b>tree</b> structured data.
          In this example a <i>tree</i> structure is being used, because it is easier to show how the algorithm works. Some terminology used:
        </p>
        <p>
          A <b>node</b> is one leaf in the tree. It always has some sort of data <i>(a number here)</i>, children information and may contain parent information, depending on the structure used.
        </p>
        <p>
          The <b>frontier</b> is the set of all nodes which can at one point be explored.
        </p>
        <p>
          A <b>leaf node</b> is a node which does not have any more children in the tree.
        </p>

        <p>
          The algorithm code used in this example is shown below.
        </p>
      </section>
      <aside>
        <pre className='markdown'>
{//eslint-disable-line
`function breadthFirstSearch (initialNode, solutionFn) {
  let frontier = [initialNode]

  while (true) {
    if (!_.size(frontier)) {
      return false
    }

    let node = frontier.shift()

    if (solutionFn(node)) {
      return node
    }

    frontier = _.concat(frontier, node.children)
  }
}`}
        </pre>
      </aside>
      <section>
        <p>
          The <i>breadthFirstSearch</i> function accepts two arguments.
          <ul>
            <li><b>initialNode</b> - the node where the search starts (in this example it will be the root node)</li>
            <li><b>solutionFn</b> - a solution function used to test if the searched node is found. This can be any function and in this example we are just checking if the node data is a specific number</li>
          </ul>
        </p>
      </section>
    </div>
  )
}
