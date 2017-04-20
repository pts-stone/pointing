class GoogleChartsMap {
  constructor(elem_id) {
    this.elem_id = elem_id
    this.data_map = {}

    var interval = () => {
      this.interval()
    }
    this.interval_instance = setInterval(interval, 1000)

    var now = Date.now()
    this.add({address: "19 Great Oak Dr", lp_name: "globalrewards", points: 100, cost: 100, timestamp: now})
    this.add({address: "19 Great Oak Dr", lp_name: "globalrewards", points: 100, cost: 100, timestamp: now})
    this.add({address: "19 Great Oak Dr", lp_name: "globalrewards", points: 100, cost: 100, timestamp: now})
    this.add({address: "Vancouver", lp_name: "united", points: 100, cost: 100, timestamp: now})
    this.add({address: "Montreal", lp_name: "hilton", points: 100, cost: 100, timestamp: now})

    //console.log(this.convert_data())
  }

  getColorForLP(lp_name) {
    return "aliceblue"
  }

  add({lat, log, address, lp_name, points, cost, timestamp}) {
    var for_timestamp = this.data_map[timestamp] = this.data_map[timestamp] || {}
    var for_location = for_timestamp[address] = for_timestamp[address] || []
    for_location.push([address, lp_name, points, cost])
  }

  reduce_for_location_data(for_location) {
    var lp_map = _.reduce(for_location, (result, data_point) => {
      var location = data_point[0]
      var lp_name = data_point[1]
      // var points = data_point[2]
      var cost = data_point[3]
      var color = this.getColorForLP(lp_name)
      var for_lp = result[lp_name] = result[lp_name] || [location, color, 0]
      result[lp_name] = [location, color, cost+for_lp[2]]
      return result
    }, {})
    return _.map(lp_map, (for_lp) => {return for_lp})
  }

  convert_data() {
    var data = _.flatMap(this.data_map, (for_timestamp) => {
      return _.flatMap(for_timestamp, (for_location) => {
        return this.reduce_for_location_data(for_location)
      })
    })
    data.unshift(["location", "color", "cost"])
    return google.visualization.arrayToDataTable(data)
  }

  draw() {
    var elem = document.getElementById(this.elem_id)
    var chart = new google.visualization.GeoChart(elem)
    var options = {
      displayMode: 'markers',
      colorAxis: {colors: ['green', 'blue']}
    }
    chart.draw(this.convert_data(), options)
  }

  interval() {
    this.draw()
  }
}
