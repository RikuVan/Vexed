import {
  updateIsLoading,
  Immutable
} from './helpers/utils'

export default {
  setIsLoading: (s, a, d) => ({key: updateIsLoading(d)(s)}),
  onInput: (s, a, data) => (data),
  setRound: (s, a, d) => ({round: Immutable.merge(s.round, d)}),
  startTimer: (s, a, d) => '',
  haltTimer: (s, a, d) => '',
  clearTimer: (s, a, d) => '',
}
