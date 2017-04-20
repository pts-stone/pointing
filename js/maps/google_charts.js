var lpsToColour = {
  'rapid-rewards': '#a7a737',
  'mileage-plan': '#0A1652'
};

class GoogleChartsMap {
  constructor(elem_id) {
    this.elem_id = elem_id
    this.data_map = {}

    var interval = () => {
      this.interval()
    }
    this.interval_instance = setInterval(interval, 1000)

    var now = Date.now()
    this.add({latitude:42.5, "longitude":1.5, lp_name: "rapid-rewards", points: 10000, cost: 100, timestamp: now})
    this.add({latitude:42.5, "longitude":1.5, lp_name: "rapid-rewards", points: 10000, cost: 100, timestamp: now+2000})
    this.add({latitude:42.5, "longitude":1.5, lp_name: "rapid-rewards", points: 10000, cost: 100, timestamp: now+3000})
    this.add({latitude:54, "longitude":-100, lp_name: "mileage-plan", points: 50000, cost: 100, timestamp: now+5000})
    this.add({latitude:54, "longitude":-100, lp_name: "mileage-plan", points: 50000, cost: 100, timestamp: now+6000})
    this.add({latitude:42.5, "longitude":1.5, lp_name: "rapid-rewards", points: 10000, cost: 100, timestamp: now+7000})
    this.add({latitude:42.5, "longitude":1.5, lp_name: "rapid-rewards", points: 10000, cost: 100, timestamp: now+7000})
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
      var for_lp = result[lp_name] = result[lp_name] || {
        latitude: lat,
        longitude: long,
        lpName: lp_name,
        points: 0,
        cost: 0
      }
      points = for_lp.points + points
      result[lp_name] = {
        latitude: lat,
        longitude: long,
        lpName: lp_name,
        points: for_lp.points + points,
        cost: for_lp.cost + cost
      }
      return result
    }, {})
    return _.map(lp_map, (for_lp) => {return for_lp})
  }

  convert_data() {
    var now = Date.now()
    var no_timestamp_data_map = {}
    for (var timestamp in this.data_map) {
      if (now - timestamp < 0) {
        continue
      }

      var for_timestamp = this.data_map[timestamp]
      for (var location in for_timestamp) {
        var for_location = for_timestamp[location]
        for (var i=0; i<for_location.length; i++) {
          var data_point = for_location[i]
          var lp_name = data_point.lpName
          var lat = data_point.latitude
          var long = data_point.longitude
          var points = data_point.points
          var cost = data_point.cost
          var result_for_location = no_timestamp_data_map[location] = no_timestamp_data_map[location] || {}
          var result_for_lp = result_for_location[lp_name] = result_for_location[lp_name] || {
            latitude: lat,
            longitude: long,
            lpName: lp_name,
            points: 0,
            cost: 0
          }
          points = result_for_lp.points + points
          result_for_location[lp_name] = {
            latitude: lat,
            longitude: long,
            lpName: null,
            points: result_for_lp.points + points,
            cost: result_for_lp.cost + cost
          }
        }
      }
    }

    var data = _.flatMap(no_timestamp_data_map, (for_location) => {
      return _.map(for_location, (for_lp) => {
        return for_lp
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
      var size =  Math.log(bubble.points)*2;

      return {
        "type": "circle",
        "theme": "light",
        "width": size,
        "height": size,
        "color": lpsToColour[bubble.lpName],
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

  removeOldData() {
    var now = Date.now()
    this.data_map = _.pickBy(this.data_map, (for_timestamp, timestamp) => {
      return now - timestamp < 3000
    })
  }

  interval() {
    this.removeOldData()
    this.draw()
  }
}
