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

  const store = {
    L,
    subscribe,
    view: L => viewState(L.lens),
    over: (L, f) => overState(L.lens, f),
    set: (L, v) => setState(L.lens, v)
  }

  return createFocus(store)(L)
}

const composeL = (L1, L2) => ({ lens: compose(L1.lens, L2.lens) })

const createFocus = ({ L, subscribe, view, over, set }) => (rootL) => {

  const currentFocus = {

    L: makeLensesFromObject(view(rootL)),

    subscribe(listener) {
      let prevValue = view(rootL)
      return subscribe((state) => {
        const value = view(rootL)
        if (!deepEqual(value, prevValue)) {
          listener(value)
          prevValue = value
        }
      })
    },

    view(L) {
      return L ? view(composeL(rootL, L)) : view(rootL)
    },

    over(L, f) {
      if (!f) {
        f = L
        L = null
      }
      if (L) over(composeL(rootL, L), f)
      else over(rootL, f)
      return currentFocus.view()
    },

    set(L, v) {
      if (!v) {
        v = L
        L = null
      }
      if (L) set(composeL(rootL, L), v)
      else set(rootL, v)
      return currentFocus.view()
    },


    focus(L) {
      return createFocus(currentFocus)(L)
    }

  }

  return currentFocus

}
