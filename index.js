/*********PREPARING THE GRAPH*********/

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600)

// create margins and dimensions
const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100
}
const graphWidth = 600 - margin.left - margin.right
const graphHeight = 600 - margin.top - margin.bottom

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left},${margin.top})`)

const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0,${graphHeight})`)

const yAxisGroup = graph.append('g')

// scales
const y = d3.scaleLinear()
  .range([graphHeight, 0])

const x = d3.scaleBand()
  .range([0, 500])
  .paddingInner(0.2)
  .paddingOuter(0.2)

// create (but don't call) the axes
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => `${d} orders`)

// update x axis text
xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange')

const t = d3.transition().duration(1000)


/***********************************/
/********THE UPDATE FUNCTION********/

const update = data => {

  // updating scale domains
  y.domain([0, d3.max(data, d => d.orders)])
  x.domain(data.map(item => item.name))

  // join data to rects
  const rects = graph.selectAll('rect')
    .data(data)

  // remove exit selection
  rects.exit().remove()

  // update current shapes in DOM
  rects.attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
  // .transition(t)
  // .attr('height', d => graphHeight - y(d.orders))
  // .attr('y', d => y(d.orders))

  // append necessary elements to DOM
  rects.enter()
    .append('rect')
    .attr('height', 0)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .attr('y', d => graphHeight)
    .merge(rects)
    .transition(t)
    .attrTween('width', widthTween)
    .attr('y', d => y(d.orders))
    .attr('height', d => graphHeight - y(d.orders))

  // call axes
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)
}



/***********************************/
/********CALLING DATA FROM FIRESTORE,
UPDATING GRAPH WITH THE DATA********/

let data = []


db.collection('dishes').onSnapshot(res => {
  res.docChanges().forEach(change => {

    const doc = { ...change.doc.data(), id: change.doc.id }

    switch (change.type) {
      case 'added':
        data.push(doc)
        break
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id)
        data[index] = doc
        break
      case 'removed':
        data.filter(item => item.id !== doc.id)
        break
      default:
        break
    }

  })

  update(data)
})

// TWEENS

const widthTween = d => {
  let i = d3.interpolate(0, x.bandwidth())
  i(1)
  return function (t) {
    return i(t)
  }
}
