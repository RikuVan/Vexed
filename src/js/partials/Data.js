import {h} from 'hyperapp' // eslint-disable-line no-unused-vars
import {select, scaleLinear, axisLeft, pie, arc, transition} from 'd3'
import {memoize} from '../helpers/utils'

const Data = memoize(({correct, flags}) => {
  const data = [correct, flags]

  const trans = transition().duration(1000)

  const svg = select('svg')
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  }
  const yScale = scaleLinear()
    .domain([0, flags * 1.2])
    .range([100 - margins.bottom, margins.top])

  let rect = svg.selectAll('rect').data(data, d => d)

  rect.exit().remove()

  const enter = rect
    .enter()
    .append('rect')
    .attr('width', 10)
    .attr('stroke', '#333')

  rect = enter
    .merge(rect)
    .attr('x', (d, i) => i * 10)
    .attr('fill', (d, i) => {
      if (i === 0) return 'green'
      return 'purple'
    })
    .transition(trans)
    .attr('height', d => 100 - yScale(+d))
    .attr('y', yScale)

  const yAxis = axisLeft().ticks(5).scale(yScale)
  svg.append('g').attr('transform', 'translate(' + [100, 0] + ')').call(yAxis)

  const p = pie()(data)

  const arc1 = arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)

  const svg2 = select('#pie')
    .append('g')
    .attr('transform', 'translate(100, 100)')
  svg2
    .selectAll('path')
    .data(p)
    .enter()
    .append('path')
    .attr('d', d => arc1(d))
    .attr('fill', (d, i) => (i % 2 === 0 ? 'blue' : 'red'))

  return (
    <span>
      <div style={{background: 'white', height: '100px', padding: '40px'}}>
        <svg id='d3' />
        <svg id='pie' style={{marginLeft: '10px'}} />
      </div>
    </span>
  )
})

export default Data
