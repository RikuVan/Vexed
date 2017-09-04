import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import {gameStates} from '../state'

const messages = {
  rankings: () => <span>Player rankings</span>,
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
  wrapMessage,
) => {
  const {active, isCorrect, elapsedTime, isLoading, expired: roundExpired} = round
  const {secondsRemaining} = timer

  if (isLoading) return null

  const welcome = gameState !== gameStates.IN_PROGRESS && !active
  const remaining = active && isCorrect === null
  const success = elapsedTime > 0 && isCorrect
  const failure = elapsedTime > 0 && isCorrect === false && !roundExpired
  const expired = roundExpired === true && active

  let message = messages.next()
  if (welcome) message = messages.welcome()
  else if (expired) message = messages.expired()
  else if (remaining) message = messages.remaining(secondsRemaining)
  else if (success) message = messages.success(elapsedTime)
  else if (failure) message = messages.failure()
  return wrapMessage(message)
}

export default ({timer, round, gameState, isRankingsView}) =>
  <div className='messages'>
    {isRankingsView
      ? <h2 className='rankings-title'>Player rankings</h2>
      : renderCurrentMessage(timer, round, gameState, messages, wrapMessage)
    }
  </div>
