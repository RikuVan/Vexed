import {
  getImageUrl,
} from './helpers/firebase'
import {
  merge,
  head,
  last
} from './helpers/utils'

export default {
  loading: (s, a, d) => {
    const key = head(d)
    const value = last(d)
    return {[key]: merge(s[key], {loading: value})}
  },
  getUrl: s => ({url: getImageUrl(s.code)}),
  setAuth: (s, a, d) => ({auth: merge(s.auth, d)}),
  onInput: (s, a, data) => (data)
}
