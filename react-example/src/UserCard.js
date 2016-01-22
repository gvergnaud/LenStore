import React, { Component, PropTypes } from 'react'
import focus from './focus'

class UserCard extends Component {

  static propTypes = {
    view: PropTypes.func.isRequired,
    over: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired
  };

  _handleKeyPress = ({ target: { value } }) => {
    const { set, L: { name } } = this.props
    set(name, value)
  };

  render() {
    const { view, L: { name } } = this.props
    return (
      <div>
        <input onKeyUp={this._handleKeyPress} />
        {view(name)}
      </div>
    )
  }
}

export default focus((L) => L.user)(UserCard)
