import { identityLens } from './Lens'
import composePropLenses from './composePropLenses'

const makeLensesFromObject = (obj, parentKeys = []) => Object.keys(obj).reduce((acc, key) => {
  const lensKeys = [...parentKeys, key]
  const lens = composePropLenses(...lensKeys)
  const value = obj[key]

  acc[key] = lens

  if (typeof value === 'object') {
    acc[key].L = makeLensesFromObject(value, lensKeys)
  }

  if (Array.isArray(value)) {
    acc[key].num = (index) => acc[key].L[index]
  }

  return acc
}, { self: identityLens })

export default makeLensesFromObject
