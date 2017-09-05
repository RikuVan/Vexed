import {h} from 'hyperapp'
import cx from 'classnames'

const Reset = ({s, a}) => {
  if (!s.auth.user) {
    return (
      <div className='cmd-view'>
        <h4>You must be logged in to access this page</h4>
      </div>
    )
  }
  return (
    <div className='cmd-view'>
      <div className='cmd-editor-instructions'>
        <h3>Instructions:</h3>
        <p>
          You can reset your game or completely delete your account from the
          database by adding the operation followed by a colon and your username
          displayed in the nav bar.
        </p>
        <h3>Examples:</h3>
        <ul>
          <li>
            to reset enter <strong>reset:flagdude</strong>
          </li>
          <li>
            to delete enter <strong>delete:flagdude</strong>
          </li>
        </ul>
        <h3>Caution:</h3>
        <p>
          Be aware that your data cannot be recovered, although if you delete
          your account you can always log back in to reestablish it.
        </p>
      </div>
      <div className='cmd-editor-wrapper'>
        <input
          className='cmd-editor'
          type='text'
          name='playerName'
          value={s.command.value}
          onchange={e => a.updateCmd({value: e.target.value})}
          onkeyup={e => (e.keyCode === 13 ? a.execCmd() : '')}
          autofocus
        />
        <button className='Button Button-destructive' onclick={a.execCmd}>
          Submit
        </button>
      </div>
      <div
        className={cx('cmd-result', {
          success: s.command.executed,
          error: s.command.error,
        })}
      >
        {s.command.executed && 'Your command has been executed'}
        {s.command.error &&
          `${s.command.error} - could not complete your request`}
      </div>
    </div>
  )
}

export default Reset
