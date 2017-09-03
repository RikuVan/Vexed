import config from '../../../secrets'
import firebase from 'firebase'

firebase.initializeApp(config.firebase)

export const db = firebase.database()
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const getImageUrl = id =>
  `https://storage.googleapis.com/vexed-509f8.appspot.com/flags/${id.toLowerCase()}.png`

const rankingsUrl =
  'https://us-central1-vexed-509f8.cloudfunctions.net/getRankings'

export const fetchRankings = async (idToken) => {
  const h = new Headers({
    Authorization: `Bearer ${idToken}`
  })
  const data = await (await fetch(rankingsUrl, {headers: h})).json()
  return data
}

export default firebase
