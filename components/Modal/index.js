import {Component, h} from 'preact' //eslint-disable-line
import PropTypes from 'prop-types'

class Modal extends Component {
  render () {
    return (
      <div className='modal'>
        {this.props.children}
        <div onClick={this.props.closeFn} className='white-modal-bg' />
      </div>
    )
  }
}

Modal.propTypes = {
  closeFn: PropTypes.func.isRequired
}

export default Modal
