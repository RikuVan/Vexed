import countries from '../json/countries'
import {Immutable} from './helpers/utils'

export const levels = {
  EASY: 10,
  MEDIUM: 5,
  HARD: 3,
}

export const gameStates = {
  UNINITIALIZED: 'uninitialized',
  STARTED: 'started',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished'
}

export default {
  auth: Immutable({
    user: null,
    error: null,
    isLoading: false
  }),
  countries: Immutable(countries),
  round: Immutable({
    flagUrl: '',
    choices: [],
    answer: null,
    active: false,
    isCorrect: null,
    elapsedTime: null,
    selected: null,
    isLoading: false,
    error: null
  }),
  game: Immutable({
    state: gameStates.UNINITIALIZED,
    correct: [],
    flagsPlayed: 0,
    level: levels.EASY,
    rating: 0,
    totalTime: 1000
  }),
  timers: Immutable({
    game: {timerId: null, secondsRemaining: null}
  })
}
