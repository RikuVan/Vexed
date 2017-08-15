export default {
  load: (s, a) => {
    a.getUrl()
  },
  notification: (s, a, d) => console.log('changed auth:', d)
}
