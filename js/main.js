/**
 * Created by stone.chao on 20/04/17.
 */
const POINTING = 'Pointing';
const chart = new GoogleChartsMap("map");

// create a function to subscribe to topics
const subscriber = function (msg, data) {
    _.forEach(data,function(obj){
      chart.add(obj);
    })
};

//Returns a random integer between min (inclusive) and max (inclusive)
const getRandomInt =function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//shuffle the array randomly
const shuffle = function(array){
    return _.shuffle(array);
};

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return obj[result];
}

function pickRandomCity(cities) {
  for (var i=0; i<5; i++) {
    var r_i = Math.floor(Math.random()*most_populous.length)
    var city_name = most_populous[r_i].toLowerCase()
    var city = cities[city_name]
    if (city) {
      return city_name
    }
  }
}

const transform = function(order){
    const payment = order.data.payment;
    const orderDetails = order.data.orderDetails;
    var city_name = payment.billingInfo.city.toLowerCase()
    var city = cities[city_name];
    if (!city) {
      city_name = pickRandomCity(cities)
      city = cities[city_name]
    }

    let bubble = {
        latitude: 43.650391,
        longitude: -79.383938,
        address: "unknown",
        lp_name: "globalrewards",
        points: 100,
        cost: 100,
        timestamp: new Date().getTime()
    };
    bubble.latitude = city.lat;
    bubble.longitude = city.lon;
    bubble.cost = payment.costs.totalCost;
    bubble.points = orderDetails.basePoints + (typeof orderDetails["bonusPoints"] === 'number' ? orderDetails["bonusPoints"] : 0);
    bubble.address = city_name.toUpperCase();
    bubble.lp_name = lpLinksToLpNames[order.data.loyaltyProgram];
    return bubble;
};

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
let token = PubSub.subscribe(POINTING, subscriber);

// publish a topic syncronously
function update() {
    let bubbles = [];
    let orders = shuffle(data);
    const size = orders.length;
    const times = getRandomInt(1, size < 20 ? size : 20 );

    for(let i = 0; i < times; i++){
        try{
            bubbles.push(transform(orders[i]));
        } catch(e){
            console.error('transform', e);
        }
    }
    PubSub.publishSync(POINTING, bubbles);
}

setInterval(update, 1000);
