/**
 * Created by stone.chao on 20/04/17.
 */
const POINTING = 'Pointing';
const chart = new GoogleChartsMap("map");

// create a function to subscribe to topics
const subscriber = function (msg, data) {
    chart.add(data);
};

//Returns a random integer between min (inclusive) and max (inclusive)
const getRandomInt =function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
var token = PubSub.subscribe(POINTING, subscriber);

// publish a topic syncronously
function update() {
    var orders = [];
    console.log(orders.length);
    const times = getRandomInt(1, orders.length < 20 ? orders.length : 20 );
    _.times(times, function(){
        orders.push({
            address: "19 Great Oak Dr",
            lp_name: "globalrewards",
            points: 100,
            cost: 100,
            timestamp: now
        })
    });
    PubSub.publishSync(POINTING, {
        address: "19 Great Oak Dr",
        lp_name: "globalrewards",
        points: 100,
        cost: 100,
        timestamp: now
    });
}

setInterval(update, 500)
