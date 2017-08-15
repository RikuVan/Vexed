import pathOr from 'ramda/src/pathOr'
import merge from 'ramda/src/merge'
import head from 'ramda/src/head'
import last from 'ramda/src/last'
import pick from 'ramda/src/pick'
import compose from 'ramda/src/compose'
import assoc from 'ramda/src/assoc'

export const getEventVal = pathOr('', ['value', 'event'])
export const pickUserData = pick(['displayName', 'photoURL'])
const getRandomInRange = (start = 0, end = 1) => Math.round(Math.random() * (end - start) + start)

export {
  pathOr,
  merge,
  head,
  last,
  pick,
  compose,
  assoc
}
