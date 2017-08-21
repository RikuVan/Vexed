
export default {
  load: (s, a) => {},

  authChange: (s, a, d) => console.log('changed auth:', d),

  timeExpired: (s, {updateRound}, d) => updateRound({active: false})
}
