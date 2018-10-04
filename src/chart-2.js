import * as d3 from 'd3'

// Set up margin/height/width

let margin = { top: 25, left: 25, right: 15, bottom: 25 }
let height = 110 - margin.top - margin.bottom
let width = 110 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales

var areaUS = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y1(function(d) {
    return yPositionScale(d.ASFR_us)
  })
  .y0(height)

var areaJapan = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y1(function(d) {
    return yPositionScale(d.ASFR_jp)
  })
  .y0(height)

// Read in your data

d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => console.log(err))

// Build your ready function that draws lines, axes, etc

function ready(datapoints) {
  let ages = datapoints.map(d => d.Age)
  xPositionScale.domain(d3.extent(ages))

  let nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)

  // console.log(nested)

  // Add an svg for each chart

  container
    .selectAll('.year-chart')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'year-chart')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)
      var datapoints = d.values
      let japanRates = d3.sum(datapoints, d => +d.ASFR_jp).toFixed(2)
      let usRates = d3.sum(datapoints, d => +d.ASFR_us).toFixed(2)

      // Add lines and text for each chart

      svg
        .append('path')
        .datum(d.values)
        .attr('d', areaUS)
        .attr('stroke', 'none')
        .attr('fill', '#2AFFFF')
        .attr('opacity', 0.5)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', areaJapan)
        .attr('stroke', 'none')
        .attr('fill', '#FF0100')
        .attr('opacity', 0.5)

      svg
        .append('text')
        .text(usRates)
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('dx', 10)
        .attr('font-size', 12)
        .attr('fill', '#2AFFFF')

      svg
        .append('text')
        .text(japanRates)
        .attr('x', width / 2)
        .attr('y', 5)
        .attr('dx', 10)
        .attr('font-size', 12)
        .attr('fill', '#FF0100')

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('dy', -15)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')

      // Add the axes

      let xAxis = d3.axisBottom(xPositionScale)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.tickValues([15, 30, 45]))

      let yAxis = d3.axisLeft(yPositionScale)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis.ticks(3))
    })
}

export { xPositionScale, yPositionScale, areaJapan, areaUS, width, height }
