import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import Loading from './Loading'
import {getEventVal, pathOr} from '../helpers/utils'

const LogInOutBtn = ({s, a}) => {
  if (s.auth.isLoading) {
    return <Loading small />
  } else if (!s.auth.user) {
    return (
      <button
        className='Button Button-white block'
        onclick={a.login}
      >
        <i className='fa fa-sign-in' /> Sign in
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

const Login = ({s, a}) => {
  return (
    <form className='form'>
      <input
        className='login__input'
        type='text'
        name='username'
        placeholder='Username'
        required
        oninput={e => a.onInput({username: getEventVal(e)})}
      />
      <input
        className='login__input'
        type='password'
        name='password'
        placeholder='Password'
        required
        oninput={e => a.onInput({password: getEventVal(e)})}
      />
    </form>
  )
}

const Logout = () => <div>Logout</div>

export default ({s, a}) => {
  return (
    <nav className='Nav'>
      <div className='Nav-item user-info'>
        <div className='user-info detail'>
          <strong>
            {pathOr('', ['auth', 'user', 'displayName'], s)}
          </strong>
        </div>
        <div className='user-info__detail'>
          Total flags: <span className='user-info__detail-number'>{s.flags}</span>
        </div>
        <div className='user-info__detail'>
          Correct: <span className='user-info__detail-number'>{s.correct}</span>
        </div>
        <div className='login'>
          <LogInOutBtn s={s} a={a} />
        </div>
      </div>
    </nav>
  )
}
