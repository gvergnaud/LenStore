# LenStore (WIP)

External state implemented with lenses !


## TODO
- pouvoir composer plusieurs stores entre eux. genre :
```js
friendsStore = createStore([
  userStore
])

userStore = createStore({
  name: 'aze',
  age: 22,
  friends: friendsStore
})
```

- implementation d'un map et d'un contramap qui s'applique a chaque fois que le
  store (ou le focus) est utilisé

- implementation de lens spécifique, genre RefLens qui prend une reférence, mais
  qui peut être vu avec view

- un middleware qui s'execute au moment du createLensesFromObject qui permet de
  choisir la lens en fonction d'une predicate
  genre :
  ```js
  const store = createStore()

  store.addLens(atomLens, (v) => !!v.$atom)
  store.addLens(refLens, (v) => !!v.$ref)

  const initialState = {
    herosById: {
      1: { name: 'Iron Man' },
      2: { name: 'Hulk' },
      3: { name: 'Invisible Man' }
    },
    visible: [
      { $ref: { object: "herosById", key: 1 } },
      { $ref: { object: "herosById", key: 2 } }
    ]
  }

  store.init(initialState)
  ```



New Target API :

Use just like a regular object :

```js

const state = {
  user: {
    username: 'toto',
    age: 22
  },
  bookmark: ['The Knick', 'Breaking Bad', 'True Detective']
}


// createStore :: InitialState -> Observable State

const store = createStore(state)

store.subscribe(state => {
  console.log(state)
})


const { L, view, over, set } = store
view(L.user.username)
over(L.user.username, username => `${username}!!`)
set(L.user.username, 'Henry')
```
