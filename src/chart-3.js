import * as d3 from 'd3'

// Create your margins and height/width

let margin = { top: 50, left: 40, right: 40, bottom: 40 }
let height = 300 - margin.top - margin.bottom
let width = 220 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales

let xPositionScale = d3
  .scalePoint()
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator

let line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

// Read in your data

Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
]).then(ready)

// Create your ready function

function ready([datapoints_world, datapoints_us]) {
  //console.log(datapoints_world)
  let nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints_world)

  let years = datapoints_world.map(function(d) {
    return d.year
  })

  xPositionScale.domain(years)

  container
    .selectAll('.country-chart')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'country-chart')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)
      let datapoints = d.values

      // Add lines and text for each chart

      svg
        .append('path')
        .datum(datapoints_us)
        .attr('d', line)
        .attr('stroke', '#808080')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('stroke', '#9E4C6D')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('dy', -30)
        .attr('font-size', 15)
        .attr('font-weight', 'bold')
        .attr('fill', '#9E4C6D')
        .attr('text-anchor', 'middle')

      svg
        .append('text')
        .text('USA')
        .attr('x', 10)
        .attr('y', 30)
        .attr('font-size', 12)
        .attr('fill', '#808080')

      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickSize(-height)
        .tickFormat(d3.format('d'))

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.tickValues([1980, 1990, 2000, 2010]))

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickFormat(d3.format('$,d'))
        .tickSize(-width)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis.tickValues([5000, 10000, 15000, 20000]))

      svg.selectAll('.tick line').attr('stroke-dasharray', '2 2')

      svg.selectAll('.domain').remove()
    })
}

export { xPositionScale, yPositionScale, line, width, height }

