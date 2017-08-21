import config from '../../../secrets'
import firebase from 'firebase'

firebase.initializeApp(config.firebase)

export const db = firebase.database()
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const getImageUrl = id =>
  `https://storage.googleapis.com/vexed-509f8.appspot.com/flags/${id.toLowerCase()}.png`

export default firebase
