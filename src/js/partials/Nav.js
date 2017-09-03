import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import Loading from './Loading'
import {getName, getTotalTimeFromSeconds} from '../helpers/utils'

const LogInOutBtn = ({s, a}) => {
  if (s.auth.isLoading) {
    return <Loading small />
  } else if (!s.auth.user) {
    return (
      <button className='Button Button-white block' onclick={a.login}>
        <i className='fa fa-sign-in' /> Sign in with Google
      </button>
    )
  }
  return (
    <button
      className='Button Button-white block destructive'
      onclick={a.logout}
    >
      <i className='fa fa-sign-out' /> Sign out
    </button>
  )
}

const Editor = ({name, a}) => (
  <div>
    <input
      className='name-editor'
      type='text'
      name='playerName'
      value={name}
      onchange={e => a.updateName({name: e.target.value})}
      onkeyup={e => (e.keyCode === 13 ? a.saveName() : '')}
      autofocus
    />
    <i className='fa fa-save' aria-hidden='true' onclick={a.saveName} />
    <i
      className='fa fa-close'
      aria-hidden='true'
      onclick={() => a.closeEditor({type: 'name'})}
    />
  </div>
)

export default ({s, a}) => {
  const loggedIn = !!s.auth.user
  return (
    <nav className='Nav'>
      <div className='Nav-item user-info'>
        <div className='user-info detail'>
          {loggedIn && !!s.editors.name && <Editor name={getName(s)} a={a} />}
          {loggedIn &&
            !s.editors.name && (
              <strong>
                {getName(s)}
                {loggedIn && (
                  <i
                    className='fa fa-pencil'
                    aria-hidden='true'
                    onclick={() => a.openEditor({type: 'name'})}
                  />
                )}
              </strong>
            )
          }
        </div>
        <div className='user-info__detail'>
          Total flags:{' '}
          <span className='user-info__detail-number'>{s.game.flagsPlayed}</span>
        </div>
        <div className='user-info__detail'>
          Correct:{' '}
          <span className='user-info__detail-number'>
            {s.game.correct.length}
          </span>
        </div>
        <div className='user-info__detail'>
          Total time:{' '}
          <span className='user-info__detail-number'>
            {getTotalTimeFromSeconds(s.game.totalTime)}
          </span>
        </div>
        <div className='login'>
          <LogInOutBtn s={s} a={a} />
        </div>
      </div>
    </nav>
  )
}
