import {db} from '../helpers/firebase'
import {Immutable} from '../helpers/utils'

const api = {
  players: () => db.ref('V0/players'),
  player: ({uid}) => db.ref(`V0/players/${uid}`),
  game: ({uid}) => db.ref(`V0/players/${uid}/game`),
  leaders: () => db.ref(`V0/leaders`)
}

const cb = snapshot => snapshot.val()

const dbFn = operation => async ({resource, uid, payload}, emit) => {
  let query = []

  if (operation !== 'remove') {
    query = payload ? [payload] : ['value', cb]
  }
  const dbRef = api[resource]({uid})

  try {
    return await dbRef[operation](...query)
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
  }
}

const get = dbFn('once')
const update = dbFn('update')
const set = dbFn('set')
const remove = dbFn('remove')
const stream = ({resource, uid, event, emit}) => {
  api[resource]({uid}).on('value', snapshot => {
    emit(event, snapshot.val())
  })
}

export default () => emit => ({
  actions: {
    firebase: {
      get: (s, a, {resource, uid, decorate}) => async update => {
        const data = await get({resource, uid})
        if (data) {
          const decoratedData = decorate ? decorate(data.val()) : data.val()
          const newData = Immutable.merge(s[resource], decoratedData)

          update({[resource]: newData})
        }
      },

      set: (s, a, {resource, uid, payload}) =>
        set({resource, uid, payload}),

      update: (s, a, {resource, uid, payload}) =>
        update({resource, uid, payload}),

      remove: (s, a, {resource, uid}) => remove({resource, uid}),

      stream: (s, a, {resource, uid, event}) => stream({resource, uid, event, emit})
    },
  },
})
