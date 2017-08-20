import {updateIsLoading, Immutable, getChoices} from './helpers/utils'
import {getImageUrl} from './helpers/firebase'
import {gameStates} from './state'

const inc = x => x + 1

export default {
  setIsLoading: (s, a, d) => ({key: updateIsLoading(d)(s)}),
  initializeRound: ({countries, game}, a, d) => update => {
    const {choices, correctAnswer} = getChoices(countries)
    const flagUrl = getImageUrl(correctAnswer, game.correct)
    a.updateRound({
      choices,
      flagUrl,
      answer: correctAnswer,
      active: false,
      isCorrect: null,
      elapsedTime: null,
      isLoading: true,
      error: null
    })
    if (game.status !== gameStates.IN_PROGRESS) {
      a.updateGame({state: gameStates.IN_PROGRESS})
    }
    a.timer.delay({
      seconds: 0.3,
      action: () => a.timer.count({seconds: game.level, name: 'game'}),
      name: 'gameTimerDelay'
    })
  },
  updateRound: ({round}, a, d) => update => update({round: Immutable.merge(round, d)}),
  updateGame: ({game}, a, d) => ({game: Immutable.merge(game, d)}),
  handleChoice: ({round, game, timers}, a, {choice}) => {
    a.timer.halt({name: 'game'})
    const isCorrect =
      choice === round.answer && timers.game.secondsRemaining > 0
    const correct = isCorrect ? game.correct.concat([choice]) : game.correct
    a.updateRound({isCorrect, active: false})
    a.updateGame({flagsPlayed: inc(game.flagsPlayed), correct})
  },
}
