import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import {Link} from '@hyperapp/router'
import Game from './Game'
import Rankings from './Rankings'
import Reset from './Reset'
import Nav from '../partials/Nav'
import GameMessage from '../partials/GameMessage'
import Map from '../partials/Map'

const Views = {
  '/': Game,
  '/rankings': Rankings,
  '/reset': Reset
}

const Main = ({s, a, FlashMessage}) => {
  const View = Views[s.router.match]
  const isRankingsView = s.router.match.includes('rankings')
  const isResetView = s.router.match.includes('reset')

  return (
    <div className='app-wrapper'>
      <div className='App'>
        <Map correct={s.game.correct} />

        <header className='App-header'>
          <i className='fa fa-flag-o' aria-hidden='true' />
          <h1>Vexed</h1>
          <h4>A game to improve your vexillogical knowledge</h4>
        </header>

        <Nav s={s} a={a} />

        <main>
          <div className='main-top'>

            {!isResetView &&
              <div className='left-top-row'>
                {(s.auth.user || isRankingsView) && (
                  <Link to={isRankingsView ? '/' : 'rankings'} go={a.router.go}>
                    <button className='Button Button-rankings'>
                      {isRankingsView ? 'Back to game' : 'Show rankings'}
                    </button>
                  </Link>
                )}
              </div>
            }

            {!isResetView &&
              <GameMessage
                timer={s.timers.game}
                round={s.round}
                gameState={s.game.state}
                isRankingsView={isRankingsView}
              />
            }

            <div className='right-top-row' />
          </div>

          <View s={s} a={a} />

          <div className='reset-link'>
            {s.auth.user && !isRankingsView && (
              <Link to={isResetView ? '/' : 'reset'} go={a.router.go}>
                <button className='Button Button-rankings'>
                  {isResetView ? 'Back to game' : 'Reset game or delete account'}
                </button>
              </Link>
            )}
          </div>
        </main>

        <FlashMessage />

        <footer>
          Flags collected by:&nbsp;
          <a href='https://github.com/hjnilsson/country-flags'>
            Hampus Joakim Nilsson
          </a>
          &nbsp;|&nbsp; Report bugs at:&nbsp;
          <a href='https://github.com/RikuVan/Vexed/issues'>Github</a>
        </footer>
      </div>
    </div>
  )
}

export default (s, a, V) => (
  <Main s={s} a={a} FlashMessage={V.Messenger.flash} />
)
