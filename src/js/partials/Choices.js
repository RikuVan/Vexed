import {h} from 'hyperapp'
import cx from 'classnames'


const Choices = ({choices, selected, handleChoice, active}) => {
  return (
    <div className='Choices-wrapper'>
      {choices.map((country, key) => {
        const code = Object.keys(country)[0]
        const isCurrent = selected === code
        return (
          <div key={key}>
            <div>
              <label
                className={cx(
                  'Choice',
                  {
                    'Choice--selected': isCurrent,
                    disabled: !active
                  })
               }
              >
                <input
                  className='Choice-radio'
                  type='radio'
                  name='countries'
                  id={code}
                  value={code}
                  onclick={e => handleChoice({choice: e.target.value})}
                  disabled={!active}
                />
                {country[code]}
              </label>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Choices
