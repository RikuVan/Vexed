const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})

admin.initializeApp(functions.config().firebase)

const db = admin.database()
const API_VERSION = 'V0'
const PLAYERS_PATH = 'players'
const GAME_PATH = 'game'
const PLAYERS = `${API_VERSION}/${PLAYERS_PATH}`

exports.addNewUser = functions.auth.user().onCreate(({data}) => {
  const {displayName, email, photoURL, uid} = data

  const payload = {
    registeredOn: admin.database.ServerValue.TIMESTAMP,
    firstTime: true,
    displayName,
    email,
    photoURL,
  }

  const onComplete = () => console.log(`${displayName} added as user`)

  return db
    .ref(PLAYERS)
    .child(uid)
    .set(payload)
    .then(onComplete)
})

const onSuccess = val => console.log('success', val)
const onError = val => console.log('failure', val)

const calculateScore = ({totalTime, correct, flagsPlayed}) => {
  const numOfCorrect = correct.length
  const timePerPlay = totalTime / numOfCorrect
  const percentCorrect = numOfCorrect / flagsPlayed
  const adjustedCorrect = numOfCorrect - (flagsPlayed - numOfCorrect)
  return Math.floor(adjustedCorrect * percentCorrect / timePerPlay)
}

exports.addRanking = functions.database
  .ref(`${PLAYERS}/{userId}/${GAME_PATH}`)
  .onWrite(event => {
    const userId = event.params.userId
    const game = event.data.val()

    const playerRankingRef = db.ref(`${PLAYERS}/${userId}/${GAME_PATH}/ranking`)

    const ranking = calculateScore(game)

    playerRankingRef.set(ranking).then(onSuccess, onError)
  })

exports.getRankings = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      res.status(403).send('Unauthorized')
      return
    }
    const idToken = req.headers.authorization.split('Bearer ')[1]

    admin
      .auth()
      .verifyIdToken(idToken)
      .then(() => {
        db
          .ref(PLAYERS)
          .once('value')
          .then(snapshot => {
            const players = snapshot.val()

            const rankings = Object.keys(players)
              .map(id => {
                const game = players[id].game
                return {
                  ranking: game.ranking,
                  playerName: game.playerName || 'anonymous',
                  played: game.flagsPlayed,
                  correct: game.correct.length,
                  averageTime: game.totalTime / game.flagsPlayed,
                }
              })
              .sort((a, b) => b.ranking - a.ranking)

            res.status(200).send(rankings)
          })
      })
      .catch(() => res.status(200).send(res.status(403).send('Unauthorized')))
  })
})
