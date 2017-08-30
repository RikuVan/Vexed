import {
  updateIsLoading,
  Immutable,
  getChoices,
  inc,
  checkForMessage,
} from './helpers/utils'
import {getImageUrl} from './helpers/firebase'
import {gameStates} from './state'

export default {
  setIsLoading: (state, a, data) => ({key: updateIsLoading(data)(state)}),

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

    const isCorrect =
      choice === round.answer && timers.game.secondsRemaining > 0
    const correct = isCorrect ? game.correct.concat([choice]) : game.correct
    const consecutiveCorrect = isCorrect ? game.consecutiveCorrect + 1 : 0

    const payload = {
      flagsPlayed: inc(game.flagsPlayed),
      correct,
      consecutiveCorrect
    }

    if (auth.user !== null) {
      await actions.firebase.update({
        resource: 'game',
        uid: auth.user.uid,
        payload: Object.assign(payload, {totalTime: game.totalTime})
      })
    } else {
      actions.store.save()
    }

    actions.updateRound({isCorrect, active: false, expired: false})
    actions.updateGame(payload)

    const message = checkForMessage(correct.length, consecutiveCorrect)

    if (message) {
      actions.timer.delay({
        name: 'accomplishment_message',
        delay: 1000,
        action: () => actions.Messenger.dispatch(message)
      })
    }
  },

  // set if localStorage fallback or firebase db
  persistTo: (s, a, {type}) => ({persistence: {type}}),

  changeLevel: (s, a, {level}) => ({
    game: Immutable.set(s.game, 'level', level),
  }),
}
