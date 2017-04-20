class GoogleChartsMap {
  constructor(elem_id) {
    this.elem_id = elem_id
    this.data_map = {}

    var interval = () => {
      this.interval()
    }
    this.interval_instance = setInterval(interval, 1000)

    var now = Date.now()
    this.add({latitude:42.5, "longitude":1.5, lp_name: "globalrewards", points: 100000, cost: 100, timestamp: now})
    this.add({latitude:42.5, "longitude":1.5, lp_name: "globalrewards", points: 100000, cost: 100, timestamp: now})
    this.add({latitude:42.5, "longitude":1.5, lp_name: "globalrewards", points: 100000, cost: 100, timestamp: now})
    this.add({latitude:54, "longitude":-100, lp_name: "globalrewards", points: 50000, cost: 100, timestamp: now})

    //console.log(this.convert_data())
  }

  getColorForLP(lp_name) {
    return "aliceblue"
  }

  add({latitude, longitude, address, lp_name, points, cost, timestamp}) {
    if (!latitude || !longitude) {
      throw new Error("No latitude or longitude")
    }
    address = address || latitude+"X"+longitude
    var for_timestamp = this.data_map[timestamp] = this.data_map[timestamp] || {}
    var for_location = for_timestamp[address] = for_timestamp[address] || []
    for_location.push({
      latitude: latitude,
      longitude: longitude,
      lpName: lp_name,
      points: points,
      cost: cost
    })
  }

  reduce_for_location_data(for_location) {
    var lp_map = _.reduce(for_location, (result, data_point) => {
      var lp_name = data_point.lpName
      var lat = data_point.latitude
      var long = data_point.longitude
      var points = data_point.points
      var cost = data_point.cost
      var color = this.getColorForLP(lp_name)
      var for_lp = result[lp_name] = result[lp_name] || {
        latitude: lat,
        longitude: long,
        lpName: lp_name,
        points: 0,
        cost: 0
      }
      result[lp_name] = {
        latitude: lat,
        longitude: long,
        lpName: lp_name,
        points: points,
        cost: for_lp.cost + cost
      }
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
    // data.unshift(["location", "color", "cost"])
    return data
  }

  draw() {
    var elem = document.getElementById(this.elem_id)
    // var chart = new google.visualization.GeoChart(elem)
    // var options = {
    //   displayMode: 'markers',
    //   colorAxis: {colors: ['green', 'blue']}
    // }
    // chart.draw(this.convert_data(), options)
    AmCharts.clear();

    var images = _.map(this.convert_data(), (bubble) => {
      var size =  bubble.points / 1000;

      return {
        "type": "circle",
        "theme": "light",
        "width": size,
        "height": size,
        "color": "#a7a737",
        "longitude": bubble.longitude,
        "latitude": bubble.latitude,
        "value": bubble.cost,
        "label": bubble.lpName
      };
    })

    AmCharts.makeChart( this.elem_id, {
      "type": "map",
      "projection": "mercator",
      "dataProvider": {
        "map": "worldLow",
        "images": images
      },
      "imagesSettings": {
        "alpha": 0.5
      }
    } );
  }

  interval() {
    this.draw()
  }
}
