import {h, app} from 'hyperapp' // eslint-disable-line no-unused-vars
import state from './state'
import actions from './actions'
import events from './events'
import main from './views/Main'
import auth from './mixins/auth'
import timer from './mixins/timer'
import '../sass/main.scss'
import devtools from 'hyperapp-redux-devtools'

console.log(process.env.NODE_ENV)

const mixins = [
  auth(),
  timer(),
  process.env.NODE_ENV === 'development' && devtools()
].filter(m => m)

app({
  state,
  view: main,
  actions,
  events,
  mixins
})
