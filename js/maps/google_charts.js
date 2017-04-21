class GoogleChartsMap {
  constructor(elem_id) {
    this.ticker_id = elem_id+"-ticker"

    this.elem_id = elem_id+"-map";
    this.data_map = {};

    var interval = () => {
      this.interval()
    };
    this.interval_instance = setInterval(interval, 1000);
    this.zoomLevel = 1
    this.zoomX = "50%"
    this.zoomY = "50%"
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

    this.ticker = this.ticker || document.getElementById(this.ticker_id)

    if (this.ticker.children.length >= 10) {
      this.ticker.removeChild(this.ticker.children[this.ticker.children.length-1])
    }

    var item = document.createElement("li")
    var color = lpsToColour[lp_name]
    item.innerHTML = "<strong style='color: "+color+"'>" + lp_name + "</strong> " + points +" points in <strong style='color: "+color+"'>"+address+"</strong>"

    if (this.ticker.children.length > 1) {
      this.ticker.insertBefore(item, this.ticker.firstChild)
    } else {
      this.ticker.appendChild(item)
    }
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
            lpName: lp_name,
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
    return data
  }

  draw() {
    if (this.map) {
      this.zoomLevel = this.map.zoomLevel()
      this.zoomX = this.map.zoomX()
      this.zoomY = this.map.zoomY()
    }

    AmCharts.clear();

    var images = _.map(this.convert_data(), (bubble) => {
      var size =  Math.log(bubble.points) * 2;
      return {
        "type": "circle",
        "theme": "light",
        "width": size,
        "height": size,
        "color": lpsToColour[bubble.lpName],
        "longitude": bubble.longitude,
        "latitude": bubble.latitude,
        "value": bubble.cost,
        "balloonText": bubble.points + " @ $" + bubble.cost,
      };
    })

    let legendData = [];
    
    Object.keys(lpsToColour).forEach(function(key) {
      legendData.push({
        "title": key,
        "color": lpsToColour[key]
      });
    });

    this.map = AmCharts.makeChart( this.elem_id, {
      "type": "map",
      "projection": "mercator",
      "theme": "dark",
      "dataProvider": {
        "map": "worldLow",
        "zoomLevel": this.zoomLevel,
        "zoomDuration": 0,
        "zoomX": this.zoomX,
        "zoomY": this.zoomY,
        "images": images
      },
      "imagesSettings": {
        "alpha": 0.5
      },
      "legend": {
        "backgroundAlpha": 0.7,
        "align": "center",
        "data": legendData,
        "position": "absolute",
        "bottom": 0,
        "verticalGap": 5,
        "markerType": "bubble",
        "backgroundColor": "#000",
        "autoMargins": false,
        "marginLeft": 0,
        "marginRight": 0,
        "fontSize": 9
      },
    } );
  }

  removeOldData() {
    var now = Date.now();
    this.data_map = _.pickBy(this.data_map, (for_timestamp, timestamp) => {
      return now - timestamp < 3000
    })
  }

  interval() {
    this.removeOldData()
    this.draw()
  }
}
