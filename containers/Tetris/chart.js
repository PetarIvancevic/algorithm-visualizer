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
      labels: _.map(this.props.data, (data, index) => index),
      datasets: [{
        label: 'Training results (Number of moves / NN first move value)',
        showLine: true,
        pointBackgroundColor: '#026696',
        backgroundColor: '#026696',
        borderColor: '#026696',
        fill: false,
        data: formattedData
      }]
    }
  }

  getGamePointsFormattedData () {
    let formattedData = _.map(this.props.data, 'numMoves')

    return {
      labels: _.map(this.props.data, (data, index) => index),
      datasets: [{
        label: 'Training results (Game number / Total Number of moves)',
        showLine: true,
        pointBackgroundColor: '#026696',
        backgroundColor: '#026696',
        borderColor: '#026696',
        fill: false,
        data: formattedData
      }]
    }
  }

  render () {
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
