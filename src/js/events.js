
export default {
  load: (s, a) => {},
  authChange: (s, a, d) => console.log('changed auth:', d),
  timeExpired: (s, a, d) => a.updateRound({active: false})
}
