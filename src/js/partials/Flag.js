import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import Loading from '../partials/Loading'

const Flag = ({round, updateRound}) => {
  const imageStyle = round.isLoading || round.error ? {display: 'none'} : {}
  return (
    <div>
      {round.isLoading && !round.error && <Loading small={false} />}
      {round.error &&
        <div className="image-error">
          Oops, that image is broken :(, try again.
        </div>}
      <img
        style={imageStyle}
        className="animated fadeIn"
        src={round.flagUrl}
        width="250"
        alt="logo"
        onload={() => updateRound({isLoading: false, active: true})}
        onerror={error => updateRound({error})}
      />
    </div>
  )
}

export default Flag
