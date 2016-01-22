import { compose } from 'ramda'
import { makeLenses, view, over, set, num } from '../src/Lens'

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


console.log(view(L.name, user))
// => Gabriel

console.log(view(L.secondFriendName, user))
// => HugoGuiillouu

console.log(over(L.name, (name) => `${name} Vergnaud`, user))
// => { name: 'Gabriel Vergnaud', age: 22, friends: [...] }

console.log(set(L.name, 'Gabz', user))
// => { name: 'Gabz', age: 22, friends: [...] }
