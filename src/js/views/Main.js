import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import Nav from '../partials/Nav'
import GameMessage from '../partials/GameMessage'
import Choices from '../partials/Choices'
import Flag from '../partials/Flag'
import Loading from '../partials/Loading'

const getHourglass = seconds => {
  if (seconds >= 7) {
    return 'start'
  } else if (seconds >= 4) {
    return 'half'
  }
  return 'end'
}

const renderFlagImage = (round, updateRound) => {
  const imageStyle = round.isLoading || round.error ? {display: 'none'} : {}
  return (
    <div>
      {round.isLoading && !round.error && <Loading small={false} />}
      {round.error &&
        <div className="image-error">
          Oops, that image is broken :(, try again.
        </div>}
      <img
        style={imageStyle}
        className="animated fadeIn"
        src={round.flagUrl}
        width="250"
        alt="logo"
        onload={() => updateRound({isLoading: false, active: true})}
        onerror={error => updateRound({error})}
      />
    </div>
  )
}

const Main = ({s, a}) =>
  <div className="App">
    <div className="App-header">
      <i className="fa fa-flag-o" aria-hidden="true" />
      <h1>Vexed</h1>
      <h4>A game to improve your vexillogical knowledge</h4>
    </div>

    <Nav s={s} a={a} />

    <main>
      <GameMessage
        timer={s.timers.game}
        round={s.round}
        gameState={s.game.state}
      />

      <div className="flag">
        {s.round.flagUrl
          ? <Flag round={s.round} updateRound={a.updateRound} />
          : <i className="fa fa-flag-o" aria-hidden="true" />}
      </div>

      <div className="options">
        <Choices
          choices={s.round.choices}
          handleChoice={a.handleChoice}
          selected={s.round.select}
          active={s.round.active}
        />
      </div>

      <div className="controls">
        <button
          className={`Button Button-main ${s.timers.game.secondsRemaining > 0 &&
          s.round.active
            ? 'active'
            : ''}`}
          onclick={a.initializeRound}
          disabled={s.round.active}
        >
          <span>
            <icon
              className={`fa fa-hourglass-${getHourglass(
                s.timers.game.secondsRemaining
              )}`}
              aria-hidden="true"
            />{' '}
            {!s.round.active ? "I'm ready to play" : '...waiting'}
          </span>
        </button>
      </div>
    </main>
  </div>

export default (s, a) => <Main s={s} a={a} />
