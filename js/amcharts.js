
var bubbles = [
  {"latitude": 38, "longitude": -97, "lpName": "rapid-rewards", "points": 20000},
  {"latitude":54, "longitude":-100, "lpName": "mileage-plan", "points": 50000}
];


var lpsToColour = {
  'rapid-rewards': '#a7a737',
  'mileage-plan': '#0A1652'
};


function addBubble(latitude, longitude, lpName, points, cost, timestamp) {

}

function draw() {
  AmCharts.clear();

  var images = [];
  for(var i=0; i<bubbles.length; i++) {
    var bubble = bubbles[i];

    size =  bubble.points / 1000;

    images.push({
      "type": "circle",
      "theme": "light",
      "width": size,
      "height": size,
      "color": lpsToColour[bubble.lpName],
      "longitude": bubble.longitude,
      "latitude": bubble.latitude,
      "value": "1000000"
    });
  }

  AmCharts.makeChart( "chartdiv", {
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


setInterval(draw, 1000);