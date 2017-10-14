import _filter from 'lodash/filter'
import _map from 'lodash/map'
import _size from 'lodash/size'
import {h, Component} from 'preact' //eslint-disable-line
import {Link} from 'preact-router'

import {implementedAlgorithms} from 'constants'

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.listAlgortihms = this.listAlgortihms.bind(this)
    this.searchAlgorithms = this.searchAlgorithms.bind(this)

    this.state = {algorithms: implementedAlgorithms}
  }

  listAlgortihms () {
    return _map(this.state.algorithms, function (implementedAlgorithm) {
      return <li>
        <Link href={`/algorithm/${implementedAlgorithm.link}`}>{implementedAlgorithm.name}</Link>
      </li>
    })
  }

  searchAlgorithms (val) {
    if (!val) {
      return this.setState({algorithms: implementedAlgorithms})
    }

    const filteredAlgorithms = _filter(implementedAlgorithms, function (implementedAlgorithm) {
      let values = val.toLowerCase().split(' ')

      for (let i = 0; i < _size(values); i++) {
        if (implementedAlgorithm.search.match(values[i])) {
          return true
        }
      }
    })

    this.setState({algorithms: filteredAlgorithms})
  }

  render () {
    return (
      <section className='algorithm-search-holder'>
        <div>
          <h2>Search algorithms:</h2>
          <input type='text' placeholder='Breadth first search' onKeyUp={e => this.searchAlgorithms(e.target.value)} />
        </div>
        <ul>
          {_size(this.state.algorithms) ? this.listAlgortihms() : <p>
              The specified algorithm could not be found...
            </p>
          }
        </ul>
      </section>
    )
  }
}
