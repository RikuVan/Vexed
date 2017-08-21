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
          a.setAuth({user: userData})
          a.firebase.get(
            {
              resource: 'player',
              uid: userData.uid
            }
          )
          emit('authChange', 'loggedIn')
        }
      })
    }
  },
  actions: {
    setAuth({auth}, a, d) {
      return {auth: Immutable.merge(auth, d)}
    },

    async login(s, {setAuth}) {
      setAuth({isLoading: true})

      try {
        const {user} = await auth.signInWithPopup(googleAuthProvider)
        const userData = pickUserData(user)

        setAuth({user: userData, isLoading: false})
        emit('authChange', 'loggedIn')
      } catch (error) {
        setAuth({error, isLoading: false})
        emit('authChange', 'loginFailed')
      }
    },

    async logout(s, {setAuth}) {
      try {
        await auth.signOut()

        setAuth({user: null, error: null, isLoading: false})
        emit('authChange', 'loggedOut')
      } catch (error) {
        console.error('logout failed: ', error.message)
        emit('authChange', 'logoutFailed')
      }
    },
  }
})
