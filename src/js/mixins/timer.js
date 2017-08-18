import {Immutable} from '../helpers/utils'

const delay = (s, action = () => {}) => {
  let timeoutId
  const promise = new Promise(resolve => {
    timeoutId = setTimeout(() => resolve(action()), s * 1000)
  })

  promise.cancel = () => clearTimeout(timeoutId)
  return promise
}

const tick = (s, action = () => {}, name) => {
  let time = s
  const intervalId = setInterval(() => {
    if (--time < 0) {
      clearInterval(intervalId)
    } else {
      action({name})
    }
  }, 1000)

  return intervalId
}

export default () => emit => ({
  actions: {
    timer: {
      count: ({timers}, a, {seconds, name}) => {
        const id = tick(seconds, a.timer.decrement, name)
        return {timers: Immutable.set(timers, name, {timerId: id, seconds})}
      },

      delay: ({timers}, a, {seconds, action, name}) => {
        const promise = delay(seconds, action)
        return {timers: Immutable.setIn(timers, [name, 'timer'], promise)}
      },

      halt: ({timers}, a, {name}) => {
        if (timers[name].timer) timers[name].timer.cancel()
        else clearInterval(timers[name].timerId)
      },

      remove: ({timers}) => ({timers: Immutable.without(timers, name)}),

      decrement: ({timers}, a, {name}) => {
        const dec = x => x - 1
        return {timers: Immutable.updateIn(timers, [name, 'seconds'], dec)}
      },
    },
  },
})
