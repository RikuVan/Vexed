import countries from '../json/countries'
import {Immutable} from './helpers/utils'

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
  }),
  timers: Immutable({})
}
