import {
  auth,
  googleAuthProvider
} from '../helpers/firebase'
import {pickUserData, Immutable} from '../helpers/utils'

export default () => emit => ({
  events: {
    load(s, a) {
      auth.onAuthStateChanged(user => {
        if (user) {
          const userData = pickUserData(user)

          emit('auth:change', {state: 'loggedIn', user: userData})
        }
      })
    },
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
  }
})
