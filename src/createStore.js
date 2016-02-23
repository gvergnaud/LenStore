import deepEqual from 'deep-equal'
import { compose } from 'ramda'
import { view, over, set } from './Lens'
import makeLensesFromObject from './makeLensesFromObject'

export default function createStore(initialState) {

  let listeners = []
  let state = initialState

  function subscribe(listener) {
    listeners.push(listener)

    return function unsubscribe() {
      let index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function updateState(newState) {
    state = newState
    listeners.forEach(listener => listener(state))
  }

  const L = makeLensesFromObject(state)

  const viewState = (lens) => view(lens, state)
  const overState = (lens, f) => updateState(over(lens, f, state))
  const setState = (lens, v) => overState(lens, () => v)

  const store = { L, subscribe, view: viewState, over: overState, set: setState }

  return createFocus(store)(L.self)
}


const createFocus = ({ L, subscribe, view, over, set }) => (rootLens) => {

  const currentFocus = {

    L: makeLensesFromObject(view(rootLens)),

    subscribe(listener) {
      let prevValue = view(rootLens)
      return subscribe((state) => {
        const value = view(rootLens)
        if (!deepEqual(value, prevValue)) {
          listener(value)
          prevValue = value
        }
      })
    },

    view(lens) {
      return lens ? view(compose(rootLens, lens)) : view(rootLens)
    },

    over(lens, f) {
      if (!f) {
        f = lens
        lens = null
      }
      if (lens) over(compose(rootLens, lens), f)
      else over(rootLens, f)
      return currentFocus.view()
    },

    set(lens, v) {
      if (!v) {
        v = lens
        lens = null
      }
      if (lens) set(compose(rootLens, lens), v)
      else set(rootLens, v)
      return currentFocus.view()
    },


    focus(lens) {
      return createFocus(currentFocus)(lens)
    }

  }

  return currentFocus

}
