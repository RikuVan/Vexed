import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import {gameStates} from '../state'

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
  const {active, isCorrect, elapsedTime} = round
  const {secondsRemaining} = timer

  const welcome = gameState === gameStates.UNINITIALIZED && !active
  const remaining = elapsedTime === null && active
  const success = elapsedTime > 0 && isCorrect
  const failure = elapsedTime > 0 && isCorrect === false

  let message = messages.expired()
  if (welcome) message = messages.welcome()
  else if (remaining) message = messages.remaining(secondsRemaining)
  else if (success) message = messages.success(secondsRemaining)
  else if (failure) message = messages.failure()
  return wrapMessage(message)
}

export default ({timer, round, gameState}) =>
  <div className="messages">
    {renderCurrentMessage(timer, round, gameState, messages, wrapMessage)}
  </div>
