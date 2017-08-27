//import partial from 'hyperapp-partial'
import {h} from 'hyperapp'
import {Immutable} from '../helpers/utils'
/*
export default config => partial.mixin('Notifier', emit => ({
  state: {
    notes: {},
  },
  actions: {
    show() {},
    hide() {},
    register({notes}, actions, config) {
      const registeredNotes = config.reduce((notes, note) => {
        notes[note.name] = {...note}
        return notes
      }, {})
      return {notes: Immutable(registeredNotes)}
    }
  },
  events: {
    load(state, {register}) {
      register(config)
    }
  },
  views: {
    notification() {
      return <div>Hi</div>
    }
  }
}))
*/
