/**
 * Created by stone.chao on 20/04/17.
 */
const POINTING = 'Pointing';
const chart = new GoogleChartsMap("map");

// create a function to subscribe to topics
const subscriber = function (msg, data) {
    console.log(data)
};

//Returns a random integer between min (inclusive) and max (inclusive)
const getRandomInt =function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//shuffle the array randomly
const shuffle = function(array){
    return _.shuffle(array);
};

const transform = function(order){
    const payment = order.value.data.payment;
    const orderDetails = order.value.data.orderDetails;
    const coordinate = latlong[payment.billingInfo.country.toUpperCase()];
    var bubble = {
        latitude: 43.650391,
        longitude: -79.383938,
        address: "unknown",
        lp_name: "globalrewards",
        points: 100,
        cost: 100,
        timestamp: new Date().getTime()
    };
    bubble.latitude = coordinate.latitude;
    bubble.longitude = coordinate.longitude;
    bubble.cost = payment.costs.totalCost;
    bubble.points = orderDetails.basePoints + (typeof orderDetails["bonusPoints"] == 'Number' ? orderDetails["bonusPoints"] : 0)
    bubble.address = [payment.billingInfo.street1, payment.billingInfo.city, payment.billingInfo.state].join();
    bubble.lp_name = orderDetails.loyaltyProgram;
    return bubble;
};

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
var token = PubSub.subscribe(POINTING, subscriber);

// publish a topic syncronously
function update() {
    var bubbles = [];
    var orders = shuffle(data["rows"]);
    const size = orders;
    console.log(size);
    const times = getRandomInt(1, orders < 20 ? size : 20 );

    for(var i = 0; i < times; i++){
        try{
            bubbles.push(transform(orders[i]));
        } catch(e){
            console.error('transform', ex.message);
        }
    }
    PubSub.publishSync(POINTING, bubbles);
};


google.charts.load('current', {'packages': ['geochart']});
google.charts.setOnLoadCallback(() => setInterval(update, 500));


