import { compose } from 'ramda'
import { makeLenses, immutableLens, propLens, view, over, set, num } from '../src/Lens'
import { Map } from 'immutable'

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
L.secondFriendName = compose(L.friends, L.num(1), L.name)
L.friends = compose(L.friends, L.mapped, L.name)


console.log(view(L.name, user))
// => Gabriel

console.log(over(L.friends, name => `${name} Familly`, user))
// => Gabriel

console.log(view(L.secondFriendName, user))
// => HugoGuiillouu

console.log(over(L.name, (name) => `${name} Vergnaud`, user))
// => { name: 'Gabriel Vergnaud', age: 22, friends: [...] }

console.log(set(L.name, 'Gabz', user))
// => { name: 'Gabz', age: 22, friends: [...] }


// You can do Immutable lenses as well
const state = new Map({ isLol: false })
const isLolLens = immutableLens('isLol')

console.log(view(isLolLens, state))
// => false

user.state = state

// And even compose it with regular lenses
const userLolLens = compose(propLens('state'), isLolLens)
console.log(set(userLolLens, true, user))
// { name: 'Gabriel', state: Map { isLol: true }, ... }
