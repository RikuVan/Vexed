import {getChoices} from './helpers/utils'
import {getImageUrl} from './helpers/firebase'

export default {
  load: (s, a) => {
    const {choices, correctAnswer} = getChoices(s.countries)
    const flagUrl = getImageUrl(correctAnswer)
    a.setRound({choices, flagUrl, answer: correctAnswer})
    a.timer.count({seconds: 10, name: 'test'})
  },
  authChange: (s, a, d) => console.log('changed auth:', d)
}
