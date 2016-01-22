import { propLens } from './Lens'
import { compose } from 'ramda'

// composePropLenses :: (Args :: [String]) -> Lens
const composePropLenses = (...keys) => compose(...keys.map(key => propLens(key)))

export default composePropLenses
