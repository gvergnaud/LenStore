import createStore from '../src/createStore'


const state = {
  user: {
    name: {
      first: 'clement',
      last: 'lesaicherre',
    },
    friends: [
      {
        name: {
          first: 'Gabriel',
          last: 'Vergnaud'
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


const { subscribe, L, view, over, set, focus } = createStore(state)




//
// console.log(view(L.user.L.name))
// console.log(view(L.user.L.name.L.first))
// console.log(view(L.user.L.name.L.last))
// set(L.user.L.name.L.last, 'Bowie')
// set(L.user.L.name.L.last, 'Boooooowie')
// over(L.user.L.name.L.last, (lastname) => `c'est ${lastname}`)
//
//
// console.log(view(L.user.L.friends.num(0).L.name.L.first))

// View

console.log(view(L.self))
// => State

console.log(view(L.user.L.name))
// => {  first: 'clement',  last: 'lesaicherre' }

console.log(view(L.user.L.name.L.first))
// => clement

console.log(view(L.user.L.name.L.last))
// => lesaicherre



// Focus

const userFocus = focus(L.user)
console.log(userFocus.view())
// => { name: {  first: 'clement',  last: 'lesaicherre' } friends: [...] }

const userNameFocus = userFocus.focus(userFocus.L.name)
console.log(userNameFocus.view())
// => {  first: 'clement',  last: 'lesaicherre' }

const userFirstNameFocus = userNameFocus.focus(userNameFocus.L.first)
console.log(userFirstNameFocus.view())
// => clement

const userLastNameFocus = userNameFocus.focus(userNameFocus.L.last) // same as focus(L.user.L.name.L.last)
console.log(userLastNameFocus.view())
// => lesaicherre





// Subscribe

subscribe((state) => console.log('State Update!', state))
userFocus.subscribe((user) => console.log('User updated!', user))
userNameFocus.subscribe((name) => console.log('UserName updated!', name))
userFirstNameFocus.subscribe((first) => console.log('UserFirstName updated!', first))
userLastNameFocus.subscribe((first) => console.log('UserLastName updated!', first))


// Set

userFirstNameFocus.set('Lol')
// => { name: {  first: 'Lol',  last: 'lesaicherre' } friends: [...] }

// /!\ You cant update the value if its is going to break your lenses

userNameFocus.set({ first: 'Hey' }) // will work but userLastNameFocus will emit undefined
// => { name: {  first: 'Hey' } friends: [...] }

// replace the current focus with the second friend
userFocus.set(userFocus.view(userFocus.L.friends.num(1)))
// => { name: {  first: 'Alexis',  last: 'Delvaque' } }



// Over



// userFirstNameFocus.over((firstname) => firstname + 'Lol')

// userFocus.over((v) => v.name + 1)
// userFocus.over(userFocus.L.name, (v) => v + 1)
//
// userFocus.set({ name: 'lol' })
// userFocus.set(userFocus.L.name, 'lol')
//
//
//
// const usernameFocus = userFocus.focus(userFocus.L.name)
// console.log(usernameFocus.view()) // etc
