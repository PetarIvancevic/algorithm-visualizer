import _ from 'lodash'
import {h, Component} from 'preact' //eslint-disable-line

import AI from 'games/tetris/ai'
import ChartComponent from 'containers/Tetris/chart'
import DrawComponent from 'containers/Tetris/drawComponent'
import Field from 'components/Field'
import TetrisHeader from 'containers/Tetris/header'

export default class TetrisAITrain extends Component {
  constructor () {
    super()
    this.createNetwork = this.createNetwork.bind(this)
    this.endAISimulation = this.endAISimulation.bind(this)
    this.refLearningRate = this.refLearningRate.bind(this)
    this.refNumGames = this.refNumGames.bind(this)
    this.refOldNetwork = this.refOldNetwork.bind(this)
    this.refDrawSpeed = this.refDrawSpeed.bind(this)
    this.trainNetwork = this.trainNetwork.bind(this)

    this.state = {
      aiSimulatorMoves: [],
      currentGame: 0,
      data: [],
      simulating: false
    }
  }

  createNetwork () {
    AI.create(this.learningRate.value, this.oldNetworkWeights.value)
    this.oldNetworkWeights.value = null
    this.setState({
      aiSimulatorMoves: [],
      currentGame: 0,
      data: [],
      simulating: false
    })
  }

  endAISimulation () {
    const {currentGame} = this.state

    this.setState({
      currentGame: currentGame + 1,
      simulating: false
    })
    this.trainNetwork(currentGame + 1)
  }

  refLearningRate (learningRate) {
    this.learningRate = learningRate
  }

  refNumGames (numGames) {
    this.numGames = numGames
  }

  refOldNetwork (oldNetworkWeights) {
    this.oldNetworkWeights = oldNetworkWeights
  }

  refDrawSpeed (drawSpeed) {
    this.drawSpeed = drawSpeed || 30
  }

  async trainNetwork (currentGame = 0) {
    const totalNumGames = this.numGames.value || 10

    if (totalNumGames <= currentGame) return

    let trainingData = await AI.train(currentGame + 1, totalNumGames)
    await this.setState({
      aiSimulatorMoves: trainingData.aiSimulatorMoves,
      currentGame,
      data: _.concat(this.state.data, trainingData.chartData),
      simulating: true
    })
  }

  render () {
    const {refDrawSpeed, refNumGames, refLearningRate, refOldNetwork} = this

    return (
      <article className='top-holder'>
        <TetrisHeader />
        <section className='train-section-block'>
          <Field
            label='Learning rate:'
            inputProperties={{
              type: 'number',
              step: 0.1,
              placeholder: 0.3,
              ref: refLearningRate
            }}
          />
          <Field
            label='Old network JSON:'
            inputProperties={{
              type: 'textarea',
              placeholder: 'Paste the old network JSON here...',
              ref: refOldNetwork
            }}
          />
          <button onClick={this.createNetwork}>CREATE</button>
        </section>
        <section className='train-section-block'>
          <Field
            label='Number of games to play:'
            inputProperties={{
              type: 'number',
              step: 1,
              ref: refNumGames,
              placeholder: 10
            }}
          />
          <Field
            label='Draw speed:'
            inputProperties={{
              type: 'number',
              step: 1,
              ref: refDrawSpeed,
              placeholder: 30
            }}
          />
          <button onClick={() => this.trainNetwork(0)}>TRAIN</button>
        </section>
        <DrawComponent
          AIPlayer
          aiSimulatorMoves={this.state.aiSimulatorMoves}
          finishGame={this.endAISimulation}
          simulating={this.state.simulating}
          drawSpeed={this.drawSpeed && this.drawSpeed.value}
        />
        <ChartComponent data={this.state.data} />
      </article>
    )
  }
}
