import pathOr from 'ramda/src/pathOr'
import reduce from 'ramda/src/reduce'
import flatten from 'ramda/src/flatten'
import pick from 'ramda/src/pick'
import converge from 'ramda/src/converge'
import compose from 'ramda/src/compose'
import divide from 'ramda/src/divide'
import ifElse from 'ramda/src/ifElse'
import __ from 'ramda/src/__'
import gt from 'ramda/src/gt'
import always from 'ramda/src/always'
import modulo from 'ramda/src/modulo'
import memoize from 'ramda/src/memoize'
import toPairs from 'ramda/src/toPairs'

import {static as Immutable} from 'seamless-immutable'

export const inc = x => +x + 1

export const round = (num, places) => {
  const multiplier = Math.pow(10, places)
  return Math.round(num * multiplier) / multiplier
}

export const updateIsLoading = (loading, state) => {
  return compose(
    loading => {
      const [key, isLoading] = loading
      return {[key]: Immutable.set(state[key], 'isLoading', isLoading)}
    },
    flatten,
    toPairs
  )(loading)
}

export const getName = converge(
  (displayName, playerName) =>
    playerName.trim().length > 0 ? playerName : displayName,
  [
    pathOr('', ['auth', 'user', 'displayName']),
    pathOr('', ['game', 'playerName']),
  ]
)

const floor = v => Math.floor(v)

// check if we should send a flash message recongnizing accomplishment
export const checkForMessage = (numberOfCorrect, consecutive) => {
  if (numberOfCorrect === 252) return {key: 'win'}
  if (consecutive > 9 && consecutive % 10 === 0) {
    return {key: 'consecutive', values: {consecutive}}
  }
  if (
    consecutive > 0 &&
    numberOfCorrect >= 10 &&
    numberOfCorrect % 50 === 0 &&
    numberOfCorrect < 300
  ) {
    return {
      key: `accomplished`,
      type: 'congrats',
      values: {done: numberOfCorrect, todo: 252 - numberOfCorrect},
    }
  }
  return null
}

// format seconds to Xh Xm Xs for nav bar
export const getTotalTimeFromSeconds = totalSeconds => {
  const hours = compose(
    ifElse(gt(__, 0), v => `${v}h `, always('')),
    floor,
    divide(__, 3600)
  )(totalSeconds)

  const minutes = compose(
    v => `${v}m `,
    floor,
    divide(__, 60),
    modulo(__, 3600)
  )(totalSeconds)

  const seconds = compose(v => `${v}s`, modulo(__, 60), modulo(__, 3600))(
    totalSeconds
  )

  return `${hours}${minutes}${seconds}`
}

// selectors
export const getEventVal = pathOr('', ['value', 'event'])
export const pickUserData = pick(['displayName', 'photoURL', 'uid'])

// handling of random country choices
export const getRandomInRangeWith = (method = () => 0) => (
  start = 0,
  end = 1
) => {
  const min = Math.ceil(start)
  const max = Math.floor(end)
  return Math.round(method() * (max - min) + min)
}
const getRandomInRange = getRandomInRangeWith(Math.random)

const getRandomCountryWith = randomFn => countries => {
  const keys = Object.keys(countries)
  const code = keys[randomFn(0, keys.length - 1)]
  return {code, choice: {[code]: countries[code]}}
}
export const getRandomCountry = getRandomCountryWith(getRandomInRange)

const getCorrectAnswerWith = randomFn => choices => {
  return Object.keys(choices[randomFn(0, choices.length - 1)])[0]
}
const getCorrectAnswer = getCorrectAnswerWith(getRandomInRange)

export const getChoices = (countries, selected = [], level = 'easy') => {
  let numberOfChoices = level === 'hard' ? 5 : 3
  // clone immutable version so I can mutate
  const pool = Object.assign({}, countries)
  const choices = []
  let ignore = selected
  // recycle if all the flags have been gone through
  if (selected.length >= 251 && selected.length <= 500) {
    ignore = selected.slice(251)
  } else if (selected > 502) {
    ignore = selected.slice(502)
  }

  do {
    const poolSize = Object.keys(pool).length
    const {code, choice} =
      poolSize === 0 ? getRandomCountry(countries) : getRandomCountry(pool)
    delete pool[code]
    const indexOfSelection = ignore.indexOf(code)
    const poolIsBigEnough = poolSize >= numberOfChoices - choices.length

    if (indexOfSelection === -1 || !poolIsBigEnough) {
      // if down to last two, give two choices
      if (poolSize === 0 && choices.length === 2) {
        break
      }
      --numberOfChoices

      if (choice) {
        choices.push(choice)
      }
    }
  } while (numberOfChoices > 0)
  return {choices, correctAnswer: getCorrectAnswer(choices)}
}

export {Immutable, pathOr, memoize, toPairs, reduce, compose}
