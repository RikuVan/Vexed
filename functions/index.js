const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const db = admin.database()
const API_VERSION = 'V0'
const PLAYERS_PATH = 'players'

exports.addNewUser = functions.auth.user().onCreate(({data}) => {
  const {displayName, email, photoURL, uid} = data

  const payload = {
    registeredOn: admin.database.ServerValue.TIMESTAMP,
    firstTime: true,
    displayName,
    email,
    photoURL
  }

  const onComplete = () => console.log(`${displayName} added as user`)

  return db.ref(`${API_VERSION}/${PLAYERS_PATH}`)
    .child(uid)
    .set(payload)
    .then(onComplete)
})
