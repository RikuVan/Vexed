import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import {Link} from '@hyperapp/router'
import Game from './Game'
import Rankings from './Rankings'
import Nav from '../partials/Nav'
import GameMessage from '../partials/GameMessage'
import Map from '../partials/Map'

const Main = ({s, a, FlashMessage}) => {
  const isRankings = s.router.match.includes('rankings')
  const View = isRankings ? Rankings : Game

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
            <div className='left-top-row'>
              {(s.auth.user || isRankings) && (
                <Link to={isRankings ? '/' : 'rankings'} go={a.router.go}>
                  <button className='Button Button-rankings'>
                    {isRankings ? 'Back to game' : 'Show rankings'}
                  </button>
                </Link>
              )}
            </div>

            <GameMessage
              timer={s.timers.game}
              round={s.round}
              gameState={s.game.state}
              isRankingsView={isRankings}
            />

            <div className='right-top-row' />
          </div>

          <View s={s} a={a} />
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
