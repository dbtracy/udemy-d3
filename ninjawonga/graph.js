const dims = {
  height: 300,
  width: 300,
  radius: 150
}
const cent = {
  x: (dims.width / 2 + 5),
  y: (dims.height / 2 + 5)
}

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150)

const graph = svg.append('g')
  .attr('transform', `translate(${cent.x}, ${cent.y})`)

const pie = d3.pie()
  .sort(null)
  .value(d => d.cost)

const arcPath = d3.arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2)

db.collection('expenses').onSnapshot(res => {

  res.docChanges().forEach(change => {

    const doc = { ...change.doc.data(), id: change.doc.id }

  })

})
