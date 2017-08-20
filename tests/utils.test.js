import {
  getChoices,
  getRandomInRangeWith
} from '../src/js/helpers/utils'

test('returns random number 3 in given range 1 and 4', () => {
  const randomNumber = getRandomInRangeWith(() => 0.5)(1, 4)
  expect(randomNumber).toBe(3)
})

test('gets three countries not already selected and one answer', () => {
  const selected = ['AE', 'AF']
  const countries = {
    AE: "United Arab Emirates",
    AF: "Afghanistan",
    AG: "Antigua and Barbuda",
    AI: "Anguilla",
    AL: "Albania",
  }
  const expectedChoices = [
    {AG: "Antigua and Barbuda"},
    {AI: "Anguilla"},
    {AL: "Albania"}
  ]
  const {choices, correctAnswer} = getChoices(countries, selected)
  expect(choices).toContainEqual({AG: "Antigua and Barbuda"})
  expect(choices).toContainEqual({AI: "Anguilla"})
  expect(choices).toContainEqual({AL: "Albania"})
  expect(correctAnswer).not.toBe('AE')
  expect(correctAnswer).not.toBe('AF')
})


