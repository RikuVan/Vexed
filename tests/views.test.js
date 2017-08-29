import {renderCurrentMessage} from '../src/js/partials/GameMessage'

let data = {
  timer: {
    secondsRemaining: 0,
  },
  round: {
    active: false,
    isCorrect: null,
    elapsedTime: null,
    expired: false
  },
  gameState: 'uninitialized',
}

const messages = {
  expired: () => 'expired',
  welcome: () => 'welcome',
  remaining: time => `remaining: ${time}`,
  success: time => `success: ${time}`,
  failure: () => 'failure',
  next: () => 'next'
}

const wrapMessage = message => message

test('uninitialized game should return welcome message', () => {
  const message = renderCurrentMessage(
    data.timer,
    data.round,
    data.gameState,
    messages,
    wrapMessage
  )

  expect(message).toBe('welcome')
})

test('active game should return remaining time', () => {
  data.gameState = 'in_progress'
  data.round.active = true
  data.timer.secondsRemaining = 3
  data.round.elapsedTime = 7

  const message = renderCurrentMessage(
    data.timer,
    data.round,
    data.gameState,
    messages,
    wrapMessage
  )

  expect(message).toBe('remaining: 3')
})

test('expired game should return expired message', () => {
  data.round.active = false
  data.timer.secondsRemaining = 0
  data.round.elapsedTime = 10
  data.round.expired = true

  const message = renderCurrentMessage(
    data.timer,
    data.round,
    data.gameState,
    messages,
    wrapMessage
  )

  expect(message).toBe('expired')
})

test('incorrect answer should return failure message', () => {
  data.timer.secondsRemaining = 5
  data.round.elapsedTime = 5
  data.round.isCorrect = false

  const message = renderCurrentMessage(
    data.timer,
    data.round,
    data.gameState,
    messages,
    wrapMessage
  )

  expect(message).toBe('failure')
})

test('correct answer should return success message', () => {
  data.round.isCorrect = true
  const message = renderCurrentMessage(
    data.timer,
    data.round,
    data.gameState,
    messages,
    wrapMessage
  )
  expect(message).toBe('success: 5')
})
