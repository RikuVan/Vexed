import {
  updateIsLoading,
  Immutable,
  getChoices,
  inc,
  checkForMessage,
  pick
} from './helpers/utils'
import {getImageUrl, fetchRankings, deleteUser} from './helpers/firebase'
import state, {gameStates, storageTypes, levels} from './state'

const gameActions = {
  initializeRound: ({countries, game}, actions) => {
    const {choices, correctAnswer} = getChoices(countries, game.correct)
    const flagUrl = getImageUrl(correctAnswer, game.correct)

    actions.updateRound({
      choices,
      flagUrl,
      answer: correctAnswer,
      active: false,
      isCorrect: null,
      elapsedTime: null,
      isLoading: true,
      error: null,
      expired: null,
      selected: null
    })

    if (game.status !== gameStates.IN_PROGRESS) {
      actions.updateGame({state: gameStates.IN_PROGRESS})
    }

    actions.timer.count({seconds: game.level, name: 'game'})
  },

  updateRound: ({round}, a, data) => update =>
    update({round: Immutable.merge(round, data)}),

  updateGame: ({game}, a, data) => ({game: Immutable.merge(game, data)}),

  handleChoice: async ({round, game, timers, auth}, actions, {choice}) => {
    actions.timer.halt({name: 'game'})
    actions.getRankings(auth.idToken)

    const isCorrect =
      choice === round.answer && timers.game.secondsRemaining > 0
    const correct = isCorrect ? game.correct.concat([choice]) : game.correct
    const consecutiveCorrect = isCorrect ? game.consecutiveCorrect + 1 : 0
    const totalTime = timers.game.secondsRemaining + game.totalTime

    const payload = {
      flagsPlayed: inc(game.flagsPlayed),
      correct,
      consecutiveCorrect,
      totalTime,
      level: game.level
    }

    if (auth.user !== null) {
      await actions.firebase.update({
        resource: 'game',
        uid: auth.user.uid,
        payload
      })
    } else {
      actions.store.save()
    }

    actions.updateRound({isCorrect, active: false, expired: round.expired, selected: choice})

    actions.updateGame(payload)

    const message = checkForMessage(correct.length, consecutiveCorrect)

    if (message) {
      actions.timer.delay({
        name: 'accomplishment_message',
        ms: 1000,
        action: () => actions.Messenger.dispatch(message)
      })
    }
  },

  expireRound: ({round}) => ({
    round: Immutable.set(round, 'expired', true)
  }),

  changeLevel: (s, a, {level}) => ({
    game: Immutable.set(s.game, 'level', level)
  }),

  reset: (s, a, d) => {
    if (d) {
      const stateToReset = pick(d, state)
      return {...stateToReset}
    }
    return {...state}
  }
}

export default {
  // set any root prop's isLoading child
  setIsLoading: (state, a, data) => updateIsLoading(data, state),

  // set if localStorage fallback or firebase db
  persistTo: ({persistence}, a, {type}) => ({persistence: Immutable.set(persistence, 'type', type)}),

  openEditor: ({editors}, a, {type}) => ({editors: Immutable.set(editors, type, true)}),

  closeEditor: ({editors}, a, {type}) => ({editors: Immutable.set(editors, type, false)}),

  updateName: ({game}, a, {name}) => ({
    game: Immutable.set(game, 'playerName', name)
  }),

  saveName: async ({auth, game}, {firebase, closeEditor}) => {
    await firebase.update({
      resource: 'game',
      uid: auth.user.uid,
      payload: {playerName: game.playerName}
    })
    closeEditor({type: 'name'})
  },

  getRankings: ({auth, rankings}, {setIsLoading}, token) => update => {
    setIsLoading({rankings: true})
    fetchRankings(token)
      .then(data => {
        update({
          rankings: Immutable.merge(rankings, {
            players: data || [],
            isLoading: false
          })
        })
      })
      .catch(error => {
        setIsLoading({rankings: false})
        console.log('error', error) // eslint-disable-line no-console
      })
  },

  deleteUser: ({auth}, a, token) => {
    deleteUser(auth.idToken)
      .then(() => {
        a.reset()
        a.persistTo(storageTypes.LOCAL)
      })
      .catch(error => {
        console.log('error', error) // eslint-disable-line no-console
      })
  },

  updateCmd: ({command}, a, data) => ({
    command: Immutable.merge(command, data)
  }),

  // reset game or delete user
  execCmd: async (s, a) => {
    const [cmd, name] = s.command.value
      .toLowerCase()
      .replace(/\s/g, '')
      .split(':')

    let error
    if (
      name !== s.game.playerName.replace(/\s/g, '').toLowerCase() &&
      name !== s.auth.user.displayName.replace(/\s/g, '').toLowerCase()
    ) {
      error = 'Incorrect player name'
    }
    if (!['reset', 'delete'].includes(cmd)) {
      error = 'Unknown command'
    }
    if (error) {
      a.updateCmd({error, value: ''})
      a.store.remove()
      a.timer.delay({
        name: 'cmd',
        ms: 4000,
        action: () => a.updateCmd({error: null})
      })
      return
    }
    if (cmd === 'reset') {
      a.reset(['game', 'round'])
      if (s.auth.user !== null) {
        await a.firebase.update({
          resource: 'game',
          uid: s.auth.user.uid,
          payload: {
            flagsPlayed: 0,
            correct: [],
            consecutiveCorrect: 0,
            totalTime: 0,
            level: levels.EASY
          }
        })
      } else {
        a.store.save()
      }
      a.updateCmd({executed: true, value: ''})

      a.timer.delay({
        name: 'cmd',
        ms: 3000,
        action: () => {
          a.updateCmd({executed: false})
          a.router.go('/')
        }
      })
    } else if (cmd === 'delete') {
      a.updateCmd({executed: true, value: ''})
      a.deleteUser()

      a.timer.delay({
        name: 'cmd',
        ms: 2000,
        action: () => {
          a.updateCmd({executed: false})
          a.router.go('/')
          a.logout()
        }
      })
    }
  },

  ...gameActions
}
