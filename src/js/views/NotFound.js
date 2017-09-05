import {h} from 'hyperapp'

const NotFound = () => (
  <div className='app-wrapper'>
    <div className='App'>
      <header className='App-header'>
        <i className='fa fa-flag-o' aria-hidden='true' />
        <h1>Vexed</h1>
        <h4>A game to improve your vexillogical knowledge</h4>
      </header>
      <main className='NotFound'>
        <h1>Oops! Nothing happening here.</h1>
      </main>
    </div>
  </div>
)

export default () => <NotFound />
