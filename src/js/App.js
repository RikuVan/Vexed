import 'whatwg-fetch'
import {app} from 'hyperapp'
import {Router} from '@hyperapp/router'
import state from './state'
import actions from './actions'
import events from './events'
import main from './views/Main'
import auth from './mixins/auth'
import store from './mixins/localStorage'
import timer from './mixins/timer'
import messenger from './mixins/messenger'
import firebaseDb from './mixins/firebaseDb'
import '../sass/main.scss'
// import devtools from 'hyperapp-redux-devtools'
import partials from 'hyperapp-partial'
import messages from '../json/messages'

app({
  state,
  view: [
    ['/', main],
    ['/rankings', main]
  ],
  actions,
  events,
  mixins: [
    Router,
    auth(),
    timer(),
    firebaseDb(),
    store({key: 'game', updateAction: 'updateGame'}),
    partials,
    messenger(messages.list),
    // devtools(),
  ],
  root: document.getElementById('app')
})
