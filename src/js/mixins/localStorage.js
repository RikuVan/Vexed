import {storageTypes} from '../state'

const STORAGE_ID = 'vexed-storage'

const serializeAndSave = state =>
  localStorage.setItem(STORAGE_ID, JSON.stringify(state))

const getAndParse = () => {
  try {
    const data = localStorage.getItem(STORAGE_ID)
    if (data) {
      return JSON.parse(data)
    } else {
      return null
    }
  } catch (error) {
    console.error('Error retrieving data from locale storage', error) // eslint-disabled-line no-console
  }
}

const remove = () => localStorage.removeItem(STORAGE_ID)

export default ({key, updateAction}) => emit => ({
  actions: {
    store: {
      save: state => {
        const data = key ? state[key] : state
        serializeAndSave(data)
      },

      get: (state, actions) => {
        const data = getAndParse()
        if (data && updateAction) {
          actions[updateAction](data)
        } else if (data) {
          return data
        }
      },

      remove
    },
  },
  events: {
    load: ({persistence}, actions) => {
      const useStore = persistence.type === storageTypes.LOCAL
      if (useStore) {
        actions.store.get()
        window.addEventListener('unload', () => actions.store.save())
      }
    }
  }
})
