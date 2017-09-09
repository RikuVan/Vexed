import config from '../../../secrets'
import firebase from 'firebase'

firebase.initializeApp(config.firebase)

export const db = firebase.database()
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

const API_URL_ROOT = 'https://us-central1-vexed-509f8.cloudfunctions.net/api'

export const getImageUrl = id =>
  `https://storage.googleapis.com/vexed-509f8.appspot.com/flags/${id.toLowerCase()}.png`

const rankingsUrl = `${API_URL_ROOT}/rankings`
const deleteUserUrl = `${API_URL_ROOT}/user`

const getAuthHeader = token => new Headers({Authorization: `Bearer ${token}`})

export const fetchRankings = async idToken => {
  const data = await (await fetch(rankingsUrl, {
    headers: getAuthHeader(idToken)
  })).json()
  return data
}

export const deleteUser = async idToken => {
  const response = await (await fetch(deleteUserUrl, {
    method: 'DELETE',
    headers: getAuthHeader(idToken)
  })).text()
  return response
}

export default firebase
