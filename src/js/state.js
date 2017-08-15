import countries from '../json/countries'
import {static as Immutable} from 'seamless-immutable'

export default {
  auth: Immutable({
    user: null,
    error: null,
    loading: false
  }),
  countries: Immutable(countries),
  count: 0,
  flags: 0,
  correct: 2,
  code: 'fi',
  url: ''
}
