import 'whatwg-fetch'
import {app} from 'hyperapp'
import {router} from '@hyperapp/router'
import partials from 'hyperapp-partial'
import state from './state'
import actions from './actions'
import events from './events'
import auth from './mixins/auth'
import store from './mixins/localStorage'
import timer from './mixins/timer'
import messenger from './mixins/messenger'
import firebaseDb from './mixins/firebaseDb'
import main from './views/Main'
import notFound from './views/NotFound'
import '../sass/main.scss'
import messages from '../json/messages'

app({
  state,
  view: [
    ['/', main],
    ['/rankings', main],
    ['/reset', main],
    ['*', notFound]
  ],
  actions,
  events,
  mixins: [
    router(),
    auth(),
    timer(),
    firebaseDb(),
    store({key: 'game', updateAction: 'updateGame'}),
    partials,
    messenger(messages.list)
  ],
  root: document.getElementById('app')
})
