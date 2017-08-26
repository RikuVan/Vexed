import {h} from 'hyperapp'
import {memoize} from '../helpers/utils'

const getHourglass = seconds => {
  if (seconds >= 7) {
    return 'start'
  } else if (seconds >= 4) {
    return 'half'
  }
  return 'end'
}

export default memoize(({gameTimer, round, onClick}) =>
  <button
    className={`Button Button-main ${gameTimer.secondsRemaining > 0 &&
    round.active
      ? 'active'
      : ''}`}
    onclick={onClick}
    disabled={round.active}
  >
    <span>
      <icon
        className={`fa fa-hourglass-${getHourglass(
          gameTimer.secondsRemaining
        )}`}
        aria-hidden='true'
      />{' '}
      {!round.active ? 'I\'m ready to play' : '...waiting'}
    </span>
  </button>
)
