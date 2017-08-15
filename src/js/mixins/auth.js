import {
  auth,
  googleAuthProvider
} from '../helpers/firebase'
import {pickUserData} from '../helpers/utils'

export default () => emit => ({
  events: {
    load(s, a) {
      auth.onAuthStateChanged(user => {
        if (user) {
          const userData = pickUserData(user)
          a.setAuth({user: userData})
          emit('notification', 'loggedIn')
        }
      })
    }
  },
  actions: {
    async login(s, a, d) {
      a.setAuth({loading: true})
      try {
        const {user} = await auth.signInWithPopup(googleAuthProvider)
        const userData = pickUserData(user)
        a.setAuth({user: userData, loading: false})
        emit('notification', 'loggedIn')
      } catch (error) {
        a.setAuth({error, loading: false})
        emit('notification', 'login failed')
      }
    },
    async logout(s, a) {
      try {
        await auth.signOut()
        a.setAuth({user: null, error: null, loading: false})
        emit('notification', 'loggedOut')
      } catch (error) {
        console.error('logout failed: ', error.message)
        emit('notification', 'logout failed')
      }
    },
  }
})
