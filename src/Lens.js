import { compose, curry, map } from 'ramda'
import Const, { getConst } from './functors/Const'
import Identity, { runIdentity } from './functors/Identity'


/* ----------------------------------------- *
        Lenses définition
* ----------------------------------------- */

// Getter :: (Key, Object) -> a
// Setter :: (Key, a, Object) -> Object

// lens :: Getter -> Setter -> Key -> (a -> b) -> Object
export const lens = curry((getter, setter, key, f, obj) =>
  map(value => setter(key, value, obj), f(getter(key, obj)))
)

export const identityLens = lens(
  (key, obj) => obj,
  (key, value, obj) => obj,
  '_' // no key needed
)


// propLens :: String -> Functor f -> Object -> f Object
export const propLens = lens(
  (key, obj) => obj[key],
  (key, value, obj) => ({ ...obj, [key]: value })
)

// immutableLens :: Key -> Functor f -> Map -> f Map
export const immutableLens = lens(
  (key, x) => x.get(key),
  (key, value, x) => x.set(key, value)
)

// num :: Number -> Functor f -> [x] -> f [x]
export const num = lens(
  (index, arr) => arr[index],
  (index, value, arr) => [ ...arr.split(0, index), value, ...arr.split(index + 1) ]
)


/* ----------------------------------------- *
        The 3 methods
* ----------------------------------------- */
// s = data structure
// a = value of a specific key or index
// Lens s a = Lens of a defined data structure (Object, Array...) and a defined key or index

// view :: Lens s a -> s -> a
export const view = curry((lens, x) => compose(getConst, lens(Const.of))(x))

// over :: Lens s a -> (a -> a) -> s -> s
export const over = curry((lens, f, x) => compose(runIdentity, lens(compose( Identity.of, f )))(x))

// set :: Lens s a -> a -> s -> s
export const set = curry((lens, v, x) => over(lens, () => v, x))


export const makeLenses = (...keys) => keys.reduce((acc, key) => ({
  ...acc,
	[key]: propLens(key)
}), { num })
