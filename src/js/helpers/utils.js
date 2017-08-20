import pathOr from 'ramda/src/pathOr'
import head from 'ramda/src/head'
import last from 'ramda/src/last'
import pick from 'ramda/src/pick'
import converge from 'ramda/src/converge'
import compose from 'ramda/src/compose'
import divide from 'ramda/src/divide'
import ifElse from 'ramda/src/ifElse'
import __ from 'ramda/src/__'
import gt from 'ramda/src/gt'
import always from 'ramda/src/always'
import modulo from 'ramda/src/modulo'

import {static as Immutable} from 'seamless-immutable'

export const updateIsLoading = state =>
  converge(
    (key, isLoading) =>
      Immutable({key: Immutable.setIn(state, [key, 'isLoading'], isLoading)}),
    [head, last]
  )

//

const floor = v => Math.floor(v)

export const getTotalTimeFromSeconds = totalSeconds => {
  const hours = compose(
    ifElse(
      gt(__, 0),
      v => `${v} h `,
      always('')
    ),
    floor,
    divide(__, 3600)
  )(totalSeconds)

  const minutes = compose(
    ifElse(
      gt(__, 0),
      v => `${v} m `,
      always('')
    ),
    floor,
    divide(__, 60),
    modulo(__, 3600)
  )(totalSeconds)

  const seconds = compose(
    ifElse(
      gt(__, 9),
      v => `${v} s`,
      v => `0${v} s`
    ),
    modulo(__, 60),
    modulo(__, 3600)
  )(totalSeconds)

  return `${hours}${minutes}${seconds}`
}

// selectors
export const getEventVal = pathOr('', ['value', 'event'])
export const pickUserData = pick(['displayName', 'photoURL', 'uid'])

// handling of random country choices
export const getRandomInRangeWith = (method = () => 0) => (start = 0, end = 1) => {
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

export const getChoicesWith = (getChoicesFn, getAnswerFn) => (
  countries,
  selected = [],
  level = 'easy'
) => {
  let numberOfChoices = level === 'hard' ? 5 : 3
  const choices = []
  do {
    const {code, choice} = getChoicesFn(countries)
    if (selected.indexOf(code) === -1) {
      --numberOfChoices
      choices.push(choice)
      selected.push(code)
    }
  } while (numberOfChoices > 0)
  return {choices, correctAnswer: getAnswerFn(choices)}
}

export const getChoices = getChoicesWith(getRandomCountry, getCorrectAnswer)

export {Immutable, pathOr}
