
export default {
  'timer:expired': (s, {updateRound}, d) => updateRound({active: false}),

  'auth:change': (s, {setAuth, persistTo, firebase}, d) => {
    const handleData = () => {
      setAuth({isLoading: false, user: d.user})
      persistTo({type: 'firebase'})
      firebase.stream({resource: 'game', uid: d.user.uid, event: 'game:update'})
    }
    switch (d.state) {
      case ('attemptLogin'):
        return setAuth({isLoading: true})
      case ('loggedIn'): return handleData()
      case ('loginFailed'):
        return setAuth({error: d.error})
      case ('logoutFailed'):
        return setAuth({error: d.error})
      default:
        return setAuth({user: null, error: null, isLoading: false})
    }
  },
  'game:update': (s, a, d) => {
    console.log(d)
  }
}
