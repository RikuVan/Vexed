import {Immutable} from './helpers/utils'
import {gameStates} from './state'

export default {
  'load': () => {
    const root = document.getElementById('app')
    const loader = document.getElementById('app-loader')
    root.removeChild(loader)
  },

  'timer:expired': (s, {handleChoice, timer, expireRound}, d) => {
    expireRound()
    timer.delay({
      seconds: 2000,
      name: 'round-over',
      action: () => handleChoice({answer: ''}),
    })
  },

  'auth:change': (
    s,
    {setAuth, persistTo, firebase, store, getToken, getRankings},
    {payload, error, state}
  ) => {
    const addState = data =>
      Immutable.set(data, 'state', gameStates.INITIALIZED)

    const handleData = async () => {
      setAuth({isLoading: false, ...payload})
      persistTo({type: 'firebase'})
      firebase.get({resource: 'game', uid: payload.user.uid, decorate: addState})
      getRankings(payload.idToken)
      store.remove()
    }

    switch (state) {
      case 'attemptLogin':
        return setAuth({isLoading: true})
      case 'loggedIn':
        return handleData()
      case 'loginFailed':
        return setAuth({error})
      case 'logoutFailed':
        return setAuth({error})
      default:
        return setAuth({user: null, error: null, isLoading: false})
    }
  },
}
