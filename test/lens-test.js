import { compose } from 'ramda'
import { makeLenses, immutableLens, propLens, view, over, set, num } from '../src/Lens'
import { Map } from 'immutable'
import expect from 'expect'

/* ----------------------------------------- *
        Let's play
* ----------------------------------------- */

const user = {
  name: 'Gabriel',
  age: 22,
  friends: [
    { name: 'Stachmou' },
    { name: 'HugoGuiillouu' }
  ]
}

const L = makeLenses('name', 'age', 'friends')
// lenses compose left to right


describe('View', () => {

  it('should read the value', () => {

    expect(view(L.name, user)).toBe('Gabriel')

  })

  it('should compose left to right', () => {

    L.secondFriendName = compose(L.friends, L.num(1), L.name)

    expect(view(L.secondFriendName, user)).toBe('HugoGuiillouu')

  })

})

describe('Over', () => {

  it('should write the value with a function, and return the complete data structure', () => {

    expect(over(L.name, (name) => `${name} Vergnaud`, user)).toEqual({
      ...user,
      name: 'Gabriel Vergnaud'
    })

  })

  it('should work on an array with a mapped lens', () => {

    L.friends = compose(L.friends, L.mapped, L.name)

    expect(over(L.friends, name => `${name} Familly`, user)).toEqual({
      ...user,
      friends: [
        { name: 'Stachmou Familly' },
        { name: 'HugoGuiillouu Familly' }
      ]
    })

  })

})

describe('Set', () => {

  it('should set the value given and return the complete data structure', () => {

    expect(set(L.name, 'Gabz', user)).toEqual({
      ...user,
      name: 'Gabz'
    })

  })

})

describe('Immutable', () => {

  const state = new Map({ isLol: false })
  const isLolLens = immutableLens('isLol')
  user.state = state

  it('view should work on ImmutableLenses', () => {

    expect(view(isLolLens, state)).toBe(false)

  })

  it('should compose with any other lens types', () => {

    const userLolLens = compose(propLens('state'), isLolLens)

    expect(set(userLolLens, true, user)).toEqual({
      ...user,
      state: new Map({ isLol: true })
    })

  })

})
