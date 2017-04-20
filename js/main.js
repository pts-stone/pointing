/**
 * Created by stone.chao on 20/04/17.
 */
const POINTING = 'Pointing';
const chart = new GoogleChartsMap("map");

// create a function to subscribe to topics
const subscriber = function ( msg, data ){
    chart.add(data);
};



// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
var token = PubSub.subscribe( POINTING, subscriber );

// publish a topic syncronously
function update(){
    const milliseconds = new Date().getTime();
    var now = Date.now();
    PubSub.publishSync( POINTING, {address: "19 Great Oak Dr", lp_name: "globalrewards", points: 100, cost: 100, timestamp: now} );
}


google.charts.load('current', {'packages': ['geochart']});
google.charts.setOnLoadCallback(() => setInterval(update, 500));