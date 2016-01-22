import React, { Component, PropTypes } from 'react'


const focus = (getLens) => Child => class extends Component {

  static displayName = 'Focus';

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { store } = this.context
    this.focus = store.focus(getLens(store.L))

    this.unsubscribe = this.focus.subscribe(() => this.forceUpdate())
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {

    const { L, view, over, set } = this.focus
    return <Child
      L={L}
      view={view}
      over={over}
      set={set}
    />
  }

}


export default focus
