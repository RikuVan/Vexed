import countries from '../json/countries'
import {Immutable} from './helpers/utils'

export const levels = {
  HARD: 3,
  MEDIUM: 5,
  EASY: 10
}

export const gameStates = {
  UNINITIALIZED: 'uninitialized',
  INITIALIZED: 'initialized',
  STARTED: 'started',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished'
}

export const storageTypes = {
  LOCAL: 'local',
  FIREBASE: 'firebase'
}

export default {
  persistence: Immutable({
    type: storageTypes.LOCAL
  }),
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
    error: null,
    expired: null
  }),
  game: Immutable({
    state: gameStates.UNINITIALIZED,
    correct: [],
    flagsPlayed: 0,
    level: levels.EASY,
    rating: 0,
    totalTime: 0
  }),
  timers: Immutable({
    game: {timerId: null, secondsRemaining: null}
  })
}
