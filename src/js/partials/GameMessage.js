import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import {gameStates} from '../state'
import {memoize} from '../helpers/utils'

const messages = {
  expired: () => <span>Oops, time expired</span>,
  welcome: () => <span>Welcome. Ready to get vexed?</span>,
  remaining: time =>
    <span>
      Time remaining: {time}
    </span>,
  success: time =>
    <span>
      Good job! Answered in {time} {time === 1 ? 'second' : 'seconds'}
    </span>,
  failure: () => <span>Wrong answer. Keep studying!</span>,
  next: () => <span>Ready for next one?</span>
}

const wrapMessage = message =>
  <div className='messages-text'>
    {message}
  </div>

export const renderCurrentMessage = (
  timer,
  round,
  gameState,
  messages,
  wrapMessage
) => {
  const {active, isCorrect, elapsedTime, isLoading, expired: roundExpired} = round
  const {secondsRemaining} = timer

  if (isLoading) return null

  const welcome = gameState !== gameStates.IN_PROGRESS && !active
  const remaining = active && isCorrect === null
  const success = elapsedTime > 0 && isCorrect
  const failure = elapsedTime > 0 && isCorrect === false
  const expired = roundExpired === true

  let message = messages.next()
  if (welcome) message = messages.welcome()
  else if (remaining) message = messages.remaining(secondsRemaining)
  else if (success) message = messages.success(elapsedTime)
  else if (failure) message = messages.failure()
  else if (expired) message = message.expired()
  return wrapMessage(message)
}

export default memoize(({timer, round, gameState}) =>
  <div className='messages'>
    {renderCurrentMessage(timer, round, gameState, messages, wrapMessage)}
  </div>
)
