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
    expect(L.self).toBeA(Function)
    expect(L.user).toBeA(Function)
    expect(L.user.L.name).toBeA(Function)
    expect(L.user.L.name.L.last).toBeA(Function)
    expect(L.user.L.name.L.first).toBeA(Function)
    expect(L.user.L.friends.num(0).L.name).toBeA(Function)
    expect(L.user.L.friends.num(0).L.name.L.first).toBeA(Function)
  })

})


describe('view', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)


  it('should show the full state with L.self lens', () => {
    expect(view(L.self)).toEqual(state)
    expect(view()).toEqual(state)
  })

  it('should show the part of the data structure a lens targets', () => {
    expect(view(L.user.L.name)).toEqual({
      first: 'Gabriel',
      last: 'Vergnaud'
    })
  })

})


describe('set', () => {

  const { subscribe, L, view, over, set, focus } = createStore(state)

  it('should give back the the focus rootState when called', () => {

    expect(set(L.user.L.name.L.last, 'Bowie')).toEqual({
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

    expect(over(L.user.L.name.L.last, (lastname) => `c'est ${lastname}`)).toEqual({
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


describe('Focus', () => {

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

    expect(view(L.user.L.name)).toEqual(state.user.name)
    expect(userNameFocus.view()).toEqual(state.user.name)

    expect(view(L.user.L.name.L.first)).toEqual(state.user.name.first)
    expect(userFirstNameFocus.view()).toEqual(state.user.name.first)
  })


  it('Set should work', () => {

    expect(userFirstNameFocus.set('Lol')).toEqual('Lol')

    expect(userNameFocus.set({ first: 'Hey', last: 'Me' })).toEqual({ first: 'Hey', last: 'Me' })

    expect(userFocus.set(userFocus.view(userFocus.L.friends.num(1)))).toEqual(state.user.friends[1])

  })




  // Over



  // userFirstNameFocus.over((firstname) => firstname + 'Lol')

  // userFocus.over((v) => v.name + 1)
  // userFocus.over(userFocus.name, (v) => v + 1)
  //
  // userFocus.set({ name: 'lol' })
  // userFocus.set(userFocus.name, 'lol')
  //
  //
  //
  // const usernameFocus = userFocus.focus(userFocus.name.lens)
  // console.log(usernameFocus.view()) // etc


  it('Subscribe', () => {

    let stateUpdateCount = 0
    let nameUpdateCount = 0

    subscribe(state => stateUpdateCount++)
    userFirstNameFocus.subscribe(userFirstName => nameUpdateCount++)

    set(L.user.L.name.L.last, 'Test')
    set(L.user.L.name.L.first, 'Test')

    expect(stateUpdateCount).toBe(2)
    expect(nameUpdateCount).toBe(1)

  })

})
