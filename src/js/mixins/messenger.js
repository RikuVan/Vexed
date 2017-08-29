import partial from 'hyperapp-partial'
import {h} from 'hyperapp'
import {Immutable} from '../helpers/utils'
import {group, combine, move, enter, leave} from '../helpers/transitions'
import {delay} from './timer'

const DEFAULT_MOVE_READY = 700
const DEFAULT_ENTER_DELAY = 300
const DEFAULT_LEAVE_READY = 5000
const DEFAULT_TYPE = 700

const transition = (leaveReady, enterReady, delay) => group(
  combine(
    move({time: 350, ready: enterReady || DEFAULT_MOVE_READY}),
    enter({name: 'slide', time: 350, delay: delay || DEFAULT_ENTER_DELAY}),
    leave({name: 'pop', time: 350, ready: leaveReady || DEFAULT_LEAVE_READY})
  )
)

const Message = ({type, message}) =>
  <div className={`Messenger Messenger--${type}`}>
    <div className='Messenger__message'>
      {message}
    </div>
  </div>

export default config =>
  partial.mixin('Messenger', emit => ({
    state: {
      messages: {},
      delay: DEFAULT_LEAVE_READY,
      active: null,
    },

    actions: {
      dispatch(s, a, {key}) {
        a.dismiss(key)
        return {active: key}
      },

      dismiss: (s, a, key) => update => {
        delay(s.delay, () => update({active: null}))
      },

      register({messages}, actions, config) {
        const registeredMessages = config.reduce((m, message) => {
          m[message.key] = {...message}
          return m
        }, {})
        return Immutable({
          messages: registeredMessages,
          delay: config.delay || DEFAULT_LEAVE_READY,
        })
      },
    },

    events: {
      load(state, {register}) {
        register(config)
      },
    },

    views: {
      flash(s, actions) {
        if (!s.active) return <span />
        const m = s.messages[s.active]
        return transition(s.delay)(
          <div className='Messenger__container'>
            <div>
              <Message type={m.type || DEFAULT_TYPE} message={m.message} />
            </div>
          </div>
        )
      },
    },
  }))
