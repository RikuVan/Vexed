import {h} from 'hyperapp'
import Choices from '../partials/Choices'
import Flag from '../partials/Flag'
import GameButton from '../partials/GameButton'
import {levels, gameStates} from '../state'
import cx from 'classnames'

const GameView = ({s, a}) => (
  <div className='Game-view'>
    <div className='flag' id='flag'>
      {s.round.flagUrl
        ? <Flag round={s.round} updateRound={a.updateRound} />
        : <i className='fa fa-flag-o' aria-hidden='true' />}
    </div>

    {!s.auth.user && s.game.state === gameStates.UNINITIALIZED &&
    <aside className='intro'>
      <h3>Welcome!</h3>
      <p>There are 252 country flags to recognize.</p>
      <p>To compare with others, sign in with Google.</p>
    </aside>
    }
    <div className='options'>
      <Choices
        choices={s.round.choices}
        handleChoice={a.handleChoice}
        selected={s.round.select}
        active={s.round.active}
        loading={s.round.isLoading}
      />
    </div>

    <div className='controls'>
      <GameButton
        gameTimer={s.timers.game}
        round={s.round}
        onClick={a.initializeRound}
      />
    </div>

    <div className='levels'>
      <div className='level-dots'>
        {Object.entries(levels).map((level, i) =>
          <div
            className={cx('dot', `dot-${i}`, {
              active: s.game.level === level[1],
            })}
            onclick={() => a.changeLevel({level: level[1]})}
          />
        )}
      </div>
    </div>
  </div>
)

export default GameView
