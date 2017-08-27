import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import Nav from '../partials/Nav'
import GameMessage from '../partials/GameMessage'
import Choices from '../partials/Choices'
import Flag from '../partials/Flag'
import GameButton from '../partials/GameButton'
import {levels} from '../state'
import cx from 'classnames'
import MapBackground from '../partials/MapBackground'

const Main = ({s, a, Notifier}) =>
  <div className='app-wrapper'>
    <div className='App'>

      <MapBackground correct={s.game.correct} />

      <header className='App-header'>
        <i className='fa fa-flag-o' aria-hidden='true' />
        <h1>Vexed</h1>
        <h4>A game to improve your vexillogical knowledge</h4>
      </header>

      <Nav s={s} a={a} />

      <main>
        <GameMessage
          timer={s.timers.game}
          round={s.round}
          gameState={s.game.state}
        />

        <div className='flag' id='flag'>
          {s.round.flagUrl
            ? <Flag round={s.round} updateRound={a.updateRound} />
            : <i className='fa fa-flag-o' aria-hidden='true' />}
        </div>

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
      </main>
      <footer>
        Flags collected by:&nbsp;
        <a href='https://github.com/hjnilsson/country-flags'>
          Hampus Joakim Nilsson
        </a>
      </footer>
    </div>
  </div>

export default (s, a) => <Main s={s} a={a} />
