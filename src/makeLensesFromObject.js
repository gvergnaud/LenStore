import { identityLens } from './Lens'
import composePropLenses from './composePropLenses'

const makeLensesFromObject = (obj, parentKeys = []) => Object.keys(obj).reduce((acc, key) => {
  const lensKeys = [...parentKeys, key]
  const lens = composePropLenses(...lensKeys)
  const value = obj[key]

  acc[key] = {
    ...(typeof value === 'object' ? makeLensesFromObject(value, lensKeys) : {}),
    ...(Array.isArray(value) ? { num: index => acc[key][index] } : {}),
    lens
  }

  return acc
}, { lens: identityLens })

export default makeLensesFromObject
