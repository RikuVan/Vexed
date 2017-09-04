import {
  auth,
  googleAuthProvider
} from '../helpers/firebase'
import {pickUserData, Immutable} from '../helpers/utils'

export default () => emit => ({
  events: {
    load(s, a) {
      auth.onAuthStateChanged(async user => {
        if (user) {
          const userData = pickUserData(user)
          const idToken = await auth.currentUser.getIdToken(false)
          emit('auth:change', {state: 'loggedIn', payload: {user: userData, idToken}})
        }
      })
    }
  },
  actions: {
    setAuth({auth}, a, d) {
      return {auth: Immutable.merge(auth, d)}
    },

    async login(s, {setAuth}) {
      emit('auth:change', {state: 'attemptLogin'})

      try {
        const {user} = await auth.signInWithPopup(googleAuthProvider)
        const userData = pickUserData(user)

        emit('auth:change', {state: 'loggedIn', user: userData})
      } catch (error) {
        emit('auth:change', {state: 'loginFailed'})
      }
    },

    async logout(s, {setAuth}) {
      try {
        await auth.signOut()

        emit('auth:change', {state: 'loggedOut'})
      } catch (error) {
        console.error('logout failed: ', error.message) // eslint-disable-line no-console
        emit('auth:change', {state: 'logoutFailed'})
      }
    },

    getToken: s => async update => {
      const idToken = await auth.currentUser.getIdToken(false)
      return update({auth: Immutable.set(s.auth, 'idToken', idToken)})
    }
  }
})
