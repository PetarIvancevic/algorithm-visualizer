import _ from 'lodash'
import {h, Component} from 'preact' //eslint-disable-line
import Charts from 'preact-chartjs-2'
import PropTypes from 'prop-types'

class ChartComponent extends Component {
  constructor () {
    super()
    this.getFormattedData = this.getFormattedData.bind(this)
  }

  getFormattedData () {
    let formattedData = _.map(this.props.data, function (data) {
      return {
        x: data.numMoves,
        y: data.firstMoveNetValue
      }
    })

    return {
      labels: _.map(this.props.data, 'numMoves'),
      datasets: [{
        label: 'Training results',
        fill: false,
        data: formattedData
      }]
    }
  }

  render () {
    const numResults = _.size(this.props.data)

    return (
      <section>
        <Charts
          type='line'
          data={this.getFormattedData()}
          options={{maintainAspectRatio: false}}
        />
      </section>
    )
  }
}

ChartComponent.PropTypes = {
  data: PropTypes.object.isRequired
}

export default ChartComponent
