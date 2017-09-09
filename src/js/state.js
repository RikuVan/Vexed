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
    isLoading: false,
    idToken: null
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
    totalTime: 0,
    consecutiveCorrect: 0,
    playerName: ''
  }),
  timers: Immutable({
    game: {timerId: null, secondsRemaining: null}
  }),
  editors: Immutable({
    name: false
  }),
  rankings: Immutable({
    isLoading: false,
    players: []
  }),
  command: Immutable({
    value: '',
    error: null,
    executed: null,
    isLoading: false
  })
}
