import partial from 'hyperapp-partial'
import {h} from 'hyperapp'
import * as u from '../helpers/utils'
import {group, combine, move, enter, leave} from '../helpers/transitions'
import {delay} from './timer'

const DEFAULT_MOVE_READY = 700
const DEFAULT_ENTER_DELAY = 300
const DEFAULT_LEAVE_READY = 5000
const DEFAULT_TYPE = 700

const replaceLiteral = (msg, literal, value) => {
  const exp = '\\{' + literal + '\\}'
  const re = new RegExp(exp, 'g')
  return msg.replace(re, value)
}

export const replaceAllLiterals = (str, tuple) => {
  const literal = tuple[0]
  const value = tuple[1]
  return replaceLiteral(str, literal, value)
}

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
      active: {}
    },

    actions: {
      dispatch(s, a, payload) {
        a.dismiss()
        return {active: payload}
      },

      dismiss: (s) => update => {
        delay(s.delay, () => update({active: {}}))
      },

      register({messages}, actions, config) {
        const registeredMessages = config.reduce((m, message) => {
          m[message.key] = {...message}
          return m
        }, {})
        return u.Immutable({
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
      flash(s, a) {
        if (!s.active.key) return <span />

        const m = s.messages[s.active.key]

        const msg = s.active.values ? u.compose(
          u.reduce(replaceAllLiterals, m.message),
          u.toPairs,
        )(s.active.values) : m.message

        return transition(s.delay)(
          <div className='Messenger__container'>
            <div>
              <Message type={s.type || m.type || DEFAULT_TYPE} message={msg} />
            </div>
          </div>
        )
      },
    },
  }))
