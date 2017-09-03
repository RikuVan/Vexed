const fs = require('fs')
const path = require('path')
const R = require('ramda')

const jsonPath = path.join(__dirname, './src/json/topo-countries.json')
const outPath = path.join(__dirname, './src/json/topo.json')

function mapTopojson() {
  const data = R.compose(JSON.parse, fs.readFileSync)(jsonPath)
  const geos = data.objects.countries.geometries
  const filteredGeos = geos.map(g => ({
    type: g.type,
    arcs: g.arcs,
    properties: R.pick(['iso_a2', 'name'], g.properties)
  }))
  data.objects.countries.geometries = filteredGeos
  fs.writeFile(outPath, JSON.stringify(data, null, 2))
}

mapTopojson()
