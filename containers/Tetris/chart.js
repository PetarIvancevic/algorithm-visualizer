import _ from 'lodash'
import {h, Component} from 'preact' //eslint-disable-line
import Charts from 'preact-chartjs-2'
import PropTypes from 'prop-types'

class ChartComponent extends Component {
  constructor () {
    super()
    this.getNNFormattedData = this.getNNFormattedData.bind(this)
    this.getGamePointsFormattedData = this.getGamePointsFormattedData.bind(this)
  }

  getNNFormattedData () {
    let formattedData = _.map(this.props.data, 'firstMoveNetValue')

    return {
      labels: _.map(this.props.data, 'numMoves'),
      datasets: [{
        label: 'Training results (Number of moves / NN first move value)',
        showLine: false,
        pointBackgroundColor: '#026696',
        fill: false,
        data: formattedData
      }]
    }
  }

  getGamePointsFormattedData () {
    let formattedData = _.map(this.props.data, 'totalPoints')

    return {
      labels: _.map(this.props.data, 'numMoves'),
      datasets: [{
        label: 'Training results (Number of moves / Total Game Points)',
        showLine: false,
        pointBackgroundColor: '#026696',
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
          data={this.getNNFormattedData()}
        />

        <Charts
          type='line'
          data={this.getGamePointsFormattedData()}
        />
      </section>
    )
  }
}

ChartComponent.PropTypes = {
  data: PropTypes.object.isRequired
}

export default ChartComponent
