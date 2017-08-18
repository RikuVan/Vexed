import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import Nav from '../components/Nav'

const Main = ({s, a}) =>
  <div className='App'>

    <div className='App-header'>
      <i className='fa fa-flag-o' aria-hidden='true' />
      <h1>Vexed</h1>
      <h4>
        A game to improve your vexillogical knowledge
      </h4>
    </div>

    <Nav s={s} a={a} />

    <main>
      <div className='messages'>
        <img src={s.round.flagUrl} />
      </div>

      <div className='flag'>
        <pre>{s.timers.test.seconds || 0}</pre>
      </div>


      <div className='options'>

      </div>

      <div className='controls'>

      </div>

    </main>
  </div>


export default (s, a) => <Main s={s} a={a} />
