import { compose, curry, map } from 'ramda'
import Const, { getConst } from './functors/Const'
import Identity, { runIdentity } from './functors/Identity'


/* ----------------------------------------- *
        Lenses définition
* ----------------------------------------- */
export const identityLens = curry((f, obj) => map(value => value, f(obj)))

// propLens :: String -> Functor f -> Object -> f Object
export const propLens = curry((key, f, obj) => map(value => ({
  ...obj,
  [key]: value
}), f(obj[key])))

// num :: Number -> Functor f -> [x] -> f [x]
export const num = curry((index, f, arr) => map(value => [
  ...arr.split(0, index),
  value,
  ...arr.split(index + 1)
], f(arr[index])))


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
