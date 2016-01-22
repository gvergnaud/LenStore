import React, { Component, PropTypes } from 'react'

class Provider extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  static childContextTypes = {
    store: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return <span>
      {this.props.children}
    </span>
  }
}


export default Provider
