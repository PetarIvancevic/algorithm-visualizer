import {h, Component} from 'preact' //eslint-disable-line

import AI from 'games/tetris/ai'
import Field from 'components/Field'
import TetrisHeader from 'containers/Tetris/header'

export default class TetrisAITrain extends Component {
  constructor () {
    super()
    this.createNetwork = this.createNetwork.bind(this)
    this.refLearningRate = this.refLearningRate.bind(this)
    this.refNumGames = this.refNumGames.bind(this)
    this.trainNetwork = this.trainNetwork.bind(this)
  }

  createNetwork () {
    AI.create(this.learningRate.value)
  }

  refLearningRate (learningRate) {
    this.learningRate = learningRate
  }

  refNumGames (numGames) {
    this.numGames = numGames
  }

  trainNetwork () {
    AI.train(this.numGames.value)
  }

  render () {
    const {refNumGames, refLearningRate} = this

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
          <button onClick={this.trainNetwork}>TRAIN</button>
        </section>
        <p>
          For now, all the logging is done in the browser console...
        </p>
      </article>
    )
  }
}
