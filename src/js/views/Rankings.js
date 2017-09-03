import {h} from 'hyperapp'
import Loading from '../partials/Loading'
import {round} from '../helpers/utils'

const Rankings = ({s, a}) => {
  const {isLoading, players} = s.rankings
  if (isLoading) {
    return (
      <div className='Rankings-view'>
        <Loading small={false} />
      </div>
    )
  }
  return (
    <div className='Rankings-view'>
      <div className='table__wrapper'>
        <table className='table' cellPadding='0' cellSpacing='0' border='0'>
          <thead>
            <tr>
              <th width='10%'>Rank</th>
              <th>Name</th>
              <th>Correct choices</th>
              <th>Total tries</th>
              <th>Seconds per try</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => {
              return (
                <tr>
                  <td>{`${i + 1}.`}</td>
                  <td>{p.playerName}</td>
                  <td>{p.correct}</td>
                  <td>{p.played}</td>
                  <td>{`${round(p.averageTime, 2)}s`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Rankings
