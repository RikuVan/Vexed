import {Immutable} from './helpers/utils'
import {gameStates} from './state'

export default {
  'timer:expired': (s, {updateRound, timer}, d) => {
    timer.delay({seconds: 1.3, name: 'round-over', action: () => updateRound({active: false})})
  },

  'auth:change': (s, {setAuth, persistTo, firebase, store}, {user, error, state}) => {
    const addState = data => Immutable.set(data, 'state', gameStates.INITIALIZED)

    const handleData = () => {
      setAuth({isLoading: false, user})
      persistTo({type: 'firebase'})
      firebase.get({resource: 'game', uid: user.uid, decorate: addState})
      store.remove()
    }

    switch (state) {
      case ('attemptLogin'):
        return setAuth({isLoading: true})
      case ('loggedIn'): return handleData()
      case ('loginFailed'):
        return setAuth({error})
      case ('logoutFailed'):
        return setAuth({error})
      default:
        return setAuth({user: null, error: null, isLoading: false})
    }
  }
}
