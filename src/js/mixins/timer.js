import {Immutable} from '../helpers/utils'

const delay = (s, action = () => {}) => {
  let timeoutId
  const promise = new Promise(resolve => {
    timeoutId = setTimeout(() => resolve(action()), s * 1000)
  })

  promise.cancel = () => clearTimeout(timeoutId)
  return promise
}

const tick = (s, action = () => {}, name, emit) => {
  let time = s
  const intervalId = setInterval(() => {
    if (--time < 0) {
      clearInterval(intervalId)
      emit('timeExpired')
    } else {
      action({name})
    }
  }, 1000)

  return intervalId
}

const dec = x => x - 1

export default () => emit => ({
  actions: {
    timer: {
      count: ({timers}, a, {seconds, name}) => {
        const id = tick(seconds, a.timer.decrement, name, emit)
        return {timers: Immutable.set(timers, name, {timerId: id, secondsRemaining: seconds})}
      },

      delay: ({timers}, a, {seconds, action, name}) => {
        const promise = delay(seconds, action)
        return {timers: Immutable.setIn(timers, [name, 'timer'], promise)}
      },

      halt: ({timers}, {timer}, {name}) => {
        if (timers[name].timer) timers[name].timer.cancel()
        else clearInterval(timers[name].timerId)
        timer.setTimes({name})
      },

      remove: ({timers}) => ({timers: Immutable.without(timers, name)}),

      decrement: ({timers}, a, {name}) =>
        ({timers: Immutable.updateIn(timers, [name, 'secondsRemaining'], dec)}),

      setTimes: ({timers, game, round}, a, {name}) => {
        const secondsRemaining = timers[name].secondsRemaining
        const secondsElapsed = game.level - secondsRemaining
        const totalTime = game.totalTime + secondsElapsed
        return {
          round: Immutable.set(round, 'elapsedTime', secondsElapsed),
          game: Immutable.set(game, 'totalTime', totalTime)
        }
      },
    },
  }
})
