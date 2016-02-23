import createStore from '../src/createStore'
import expect from 'expect'


const state = {
  user: {
    name: {
      first: 'Gabriel',
      last: 'Vergnaud'
    },
    friends: [
      {
        name: {
          first: 'Clement',
          last: 'Lesaicherre',
        }
      },
      {
        name: {
          first: 'Alexis',
          last: 'Delvaque'
        }
      },
    ]
  }
}


describe('createStore', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)


  it('should return an object with a subscribe function property', () => {

    expect(subscribe).toBeA(Function)

  })

  it('should return an object with a L Object property', () => {

    expect(L).toBeA(Object)

  })

  it('should return an object with a view Function property', () => {

    expect(view).toBeA(Function)

  })

  it('should return an object with a over Function property', () => {

    expect(over).toBeA(Function)

  })

  it('should return an object with a focus Function property', () => {

    expect(focus).toBeA(Function)

  })

})


describe('L', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)


  it('should be a tree of lenses that represent the initial state', () => {
    expect(L.lens).toBeA(Function)
    expect(L.user.lens).toBeA(Function)
    expect(L.user.name.lens).toBeA(Function)
    expect(L.user.name.last.lens).toBeA(Function)
    expect(L.user.name.first.lens).toBeA(Function)
    expect(L.user.friends.num(0).name.lens).toBeA(Function)
    expect(L.user.friends.num(0).name.first.lens).toBeA(Function)
  })

})


describe('view', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)


  it('should show the full state with L.self lens', () => {
    expect(view(L)).toEqual(state)
    expect(view()).toEqual(state)
  })

  it('should show the part of the data structure a lens targets', () => {

    expect(view(L.user.name)).toEqual({
      first: 'Gabriel',
      last: 'Vergnaud'
    })
  })

})


describe('set', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)

  it('should give back the the focus rootState when called', () => {

    expect(set(L.user.name.last, 'Bowie')).toEqual({
      ...state,
      user: {
        ...state.user,
        name: {
          ...state.user.name,
          last: 'Bowie'
        }
      }
    })

  })

})


describe('over', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)

  it('should give back the focus rootState when called', () => {

    expect(over(L.user.name.last, (lastname) => `c'est ${lastname}`)).toEqual({
      ...state,
      user: {
        ...state.user,
        name: {
          ...state.user.name,
          last: `c'est Vergnaud`
        }
      }
    })

  })

})


describe('Focus View', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)

  const userFocus = focus(L.user)
  const userNameFocus = userFocus.focus(userFocus.L.name)
  const userFirstNameFocus = userNameFocus.focus(userNameFocus.L.first)


  it('should return an object with a subscribe function property', () => {

    expect(userFocus.subscribe).toBeA(Function)

  })

  it('should return an object with a L Object property', () => {

    expect(userFocus.L).toBeA(Object)

  })

  it('should return an object with a view Function property', () => {

    expect(userFocus.view).toBeA(Function)

  })

  it('should return an object with a over Function property', () => {

    expect(userFocus.over).toBeA(Function)

  })

  it('should return an object with a focus Function property', () => {

    expect(userFocus.focus).toBeA(Function)

  })



  it('view should work', () => {
    expect(view(L.user)).toEqual(state.user)
    expect(userFocus.view()).toEqual(state.user)

    expect(view(L.user.name)).toEqual(state.user.name)
    expect(userNameFocus.view()).toEqual(state.user.name)

    expect(view(L.user.name.first)).toEqual(state.user.name.first)
    expect(userFirstNameFocus.view()).toEqual(state.user.name.first)
  })

})


describe('Focus Set', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)

  const userFocus = focus(L.user)
  const userNameFocus = userFocus.focus(userFocus.L.name)
  const userFirstNameFocus = userNameFocus.focus(userNameFocus.L.first)

  it('Set should work', () => {

    expect(userFirstNameFocus.set('Lol')).toEqual('Lol')

    expect(userNameFocus.set({ first: 'Hey', last: 'Me' })).toEqual({ first: 'Hey', last: 'Me' })

    expect(userFocus.set(userFocus.view(userFocus.L.friends.num(1)))).toEqual(state.user.friends[1])

  })

})

describe('Focus Over', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)

  const userFocus = focus(L.user)
  const userNameFocus = userFocus.focus(userFocus.L.name)
  const userFirstNameFocus = userNameFocus.focus(userNameFocus.L.first)


  it('Over should work', () => {

    expect(userFirstNameFocus.over(firstname => firstname + 'Lol')).toBe('GabrielLol')

    expect(
      userFocus.over(
        userFocus.L.name,
        name => ({ ...name, nickname: 'Gab' })
      )
    ).toEqual({
      ...state.user,
      name: {
        ...state.user.name,
        first: 'GabrielLol',
        nickname: 'Gab'
      }
    })

  })

})

describe('Focus Subscribe', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)

  const userFocus = focus(L.user)
  const userNameFocus = userFocus.focus(userFocus.L.name)
  const userFirstNameFocus = userNameFocus.focus(userNameFocus.L.first)

  it('Subscribe', () => {

    let stateUpdateCount = 0
    let nameUpdateCount = 0

    subscribe(state => stateUpdateCount++)
    userFirstNameFocus.subscribe(userFirstName => nameUpdateCount++)

    set(L.user.name.last, 'Test')
    set(L.user.name.first, 'Test')

    expect(stateUpdateCount).toBe(2)
    expect(nameUpdateCount).toBe(1)

  })

})
