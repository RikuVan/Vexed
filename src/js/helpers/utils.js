import pathOr from 'ramda/src/pathOr'
import head from 'ramda/src/head'
import last from 'ramda/src/last'
import pick from 'ramda/src/pick'
import compose from 'ramda/src/compose'
import converge from 'ramda/src/converge'
import curry from 'ramda/src/curry'
import set from 'ramda/src/set'
import apply from 'ramda/src/apply'
import map from 'ramda/src/map'
import __ from 'ramda/src/__'
import cond from 'ramda/src/cond'
import is from 'ramda/src/is'
import T from 'ramda/src/T'
import lensIndex from 'ramda/src/lensIndex'
import lensProp from 'ramda/src/lensProp'

import {static as Immutable} from 'seamless-immutable'

export const updateIn = curry((path, val, obj) => compose(
  set(__, val, obj),
  apply(compose),
  map(cond([[is(Number), lensIndex], [T, lensProp]]))
)(path))

export const updateIsLoading = state => converge(
  (key, isLoading) => Immutable({key: updateIn([key, 'isLoading'], isLoading, state)}),
  [head, last]
)

// selectors
export const getEventVal = pathOr('', ['value', 'event'])
export const pickUserData = pick(['displayName', 'photoURL', 'uid'])

export const getChoices = (countries, level = 'easy') => {
  let numberOfChoices = level === 'hard' ? 5 : 3
  const choices = []
  const codes = []
  do {
    const {code, choice} = getRandomCountry(countries)
    if (codes.indexOf(code) === -1) {
      --numberOfChoices
      choices.push(choice)
      codes.push(code)
    }
  } while (numberOfChoices > 0)
  return {choices, correctAnswer: getCorrectAnswer(choices)}
}

// choice handling
function getRandomInRange(start = 0, end = 1) {
  return Math.round(Math.random() * (end - start) + start)
}

function getRandomCountry(countries) {
  const keys = Object.keys(countries)
  const code = keys[getRandomInRange(0, keys.length - 1)]
  return {code, choice: {[code]: countries[code]}}
}

function getCorrectAnswer(choices) {
  return Object.keys(choices[getRandomInRange(0, choices.length - 1)])[0]
}

export { Immutable, pathOr }
