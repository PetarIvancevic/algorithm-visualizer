import {h} from 'preact' //eslint-disable-line

export default function Info () {
  return (
    <div>
      <section>
        <p>
          <b>Breadth first search (BFS)</b> is an algorithm used for searching <b>graph</b> or <b>tree</b> structured data.
          This example is using a <i>tree</i> because it is easier to show how the algorithm works.
          If for example a <i>graph</i> was used, then a starting node needs to be defined, so the algorithm knows where to start the search.
        </p>
        <p>
          The algorithm code used in this example is shown below. <i>(Explored sections have been removed for simplicity.)</i>
        </p>
      </section>
      <aside>
        <pre className='markdown'>
{//eslint-disable-line
`function breadthSearch (initialNode, solutionFn) {
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
    </div>
  )
}
