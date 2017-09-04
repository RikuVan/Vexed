import {
  updateIsLoading,
  Immutable,
  getChoices,
  inc,
  checkForMessage,
} from './helpers/utils'
import {getImageUrl, fetchRankings} from './helpers/firebase'
import {gameStates} from './state'

const gameActions = {
  initializeRound: ({countries, game}, actions, d) => update => {
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
    })

    if (game.status !== gameStates.IN_PROGRESS) {
      actions.updateGame({state: gameStates.IN_PROGRESS})
    }

    actions.timer.count({seconds: game.level, name: 'game'})
  },

  updateRound: ({round}, actions, data) => update =>
    update({round: Immutable.merge(round, data)}),

  updateGame: ({game}, a, data) => ({game: Immutable.merge(game, data)}),

  handleChoice: async ({round, game, timers, auth}, actions, {choice}) => {
    actions.timer.halt({name: 'game'})
    actions.getRankings()
    const isCorrect =
      choice === round.answer && timers.game.secondsRemaining > 0
    const correct = isCorrect ? game.correct.concat([choice]) : game.correct
    const consecutiveCorrect = isCorrect ? game.consecutiveCorrect + 1 : 0
    const totalTime = timers.game.secondsRemaining + game.totalTime

    const payload = {
      flagsPlayed: inc(game.flagsPlayed),
      correct,
      consecutiveCorrect,
      totalTime
    }

    if (auth.user !== null) {
      await actions.firebase.update({
        resource: 'game',
        uid: auth.user.uid,
        payload,
      })
    } else {
      actions.store.save()
    }

    actions.updateRound({isCorrect, active: false, expired: round.expired})
    actions.updateGame(payload)

    const message = checkForMessage(correct.length, consecutiveCorrect)

    if (message) {
      actions.timer.delay({
        name: 'accomplishment_message',
        delay: 1000,
        action: () => actions.Messenger.dispatch(message),
      })
    }
  },

  expireRound: ({round}) => ({
    round: Immutable.set(round, 'expired', true),
  }),

  changeLevel: (s, a, {level}) => ({
    game: Immutable.set(s.game, 'level', level),
  }),
}

export default {
  // set any root prop's isLoading child
  setIsLoading: (state, a, data) => updateIsLoading(data, state),

  // set if localStorage fallback or firebase db
  persistTo: (s, a, {type}) => ({persistence: {type}}),

  openEditor: ({editors}, a, {type}) => ({editors: {[type]: true}}),

  closeEditor: ({editors}, a, {type}) => ({editors: {[type]: false}}),

  updateName: ({game}, a, {name}) => ({
    game: Immutable.set(game, 'playerName', name),
  }),

  saveName: async ({auth, game}, {firebase, closeEditor}) => {
    await firebase.update({
      resource: 'game',
      uid: auth.user.uid,
      payload: {playerName: game.playerName},
    })
    closeEditor({type: 'name'})
  },

  getRankings: ({auth, rankings}, {setIsLoading}, token) => update => {
    setIsLoading({rankings: true})
    fetchRankings(token)
      .then(data => {
        update({
          rankings: Immutable.merge(rankings, {
            players: data,
            isLoading: false,
          }),
        })
      })
      .catch(() => {
        setIsLoading({rankings: false})
        console.log('Not authorized to load rankings') // eslint-disable-line no-console
      })
  },

  ...gameActions,
}
