import {db} from '../helpers/firebase'

const api = {
  players: () => db.ref('V0/players'),
  player: ({uid}) => db.ref(`V0/players/${uid}`),
}

const cb = snapshot => snapshot.val()

const dbFn = operation => async ({resource, uid, payload}) => {
  // firebase.database.ref('player').once('value')
  let query = []
  if (operation !== 'remove') {
    query = payload ? [payload] : ['value', cb]
  }
  const dbRef = api[resource](uid)
  try {
    return await dbRef[operation](...query)
  } catch (error) {
    console.log(error)
  }
}

const get = dbFn('once')
const update = dbFn('update')
const set = dbFn('set')
const remove = dbFn('remove')

export default () => emit => ({
  events: {},
  actions: {
    firebase: {
      get: (s, a, {resource, uid}) => async update => {
        const data = await get({resource, uid})
        update({data})
      },
      set: (s, a, {resource, uid, payload}) => {
        set({resource, uid, payload})
      },
      update: (s, a, {resource, uid, payload}) => {
        update({resource, uid, payload})
      },
      remove: (s, a, {resource, uid}) => {
        remove({resource, uid})
      },
    },
  },
})
