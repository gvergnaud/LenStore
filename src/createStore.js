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

  const viewState = ({ lens }) => view(lens, state)
  const overState = ({ lens }, f) => updateState(over(lens, f, state))
  const setState = (L, v) => overState(L, () => v)

  const store = { L, subscribe, view: viewState, over: overState, set: setState }

  return createFocus(store)(L)
}


const createFocus = ({ L, subscribe, view, over, set }) => ({ lens: rootLens }) => {

  const currentFocus = {

    L: makeLensesFromObject(view({ lens: rootLens })),

    subscribe(listener) {
      let prevValue = view({ lens: rootLens })
      return subscribe((state) => {
        const value = view({ lens: rootLens })
        if (!deepEqual(value, prevValue)) {
          listener(value)
          prevValue = value
        }
      })
    },

    view(L) {
      return L ? view({ lens: compose(rootLens, L.lens) }) : view({ lens: rootLens })
    },

    over(L, f) {
      if (!f) {
        f = L
        L = null
      }
      if (L) over({ lens: compose(rootLens, L.lens) }, f)
      else over({ lens: rootLens }, f)
      return currentFocus.view()
    },

    set(L, v) {
      if (!v) {
        v = L
        L = null
      }
      if (L) set({ lens: compose(rootLens, L.lens) }, v)
      else set({ lens: rootLens }, v)
      return currentFocus.view()
    },


    focus(L) {
      return createFocus(currentFocus)(L)
    }

  }

  return currentFocus

}
