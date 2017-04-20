function getColorForLP(lp_name) {
  return "aliceblue"
}

/**
 * Created by stone.chao on 20/04/17.
 */
const POINTING = 'Pointing';

// create a function to subscribe to topics
const subscriber = function ( msg, data ){
    document.getElementById("map").innerHTML = data;
};

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
var token = PubSub.subscribe( POINTING, subscriber );

// publish a topic syncronously
function update(){
    const milliseconds = new Date().getTime();
    PubSub.publishSync( POINTING, 'hello world! Now is '+ milliseconds );
}

function connect(){
    document.getElementById("map").innerHTML = "hello word!";

    new GoogleChartsMap("map")
}

//trigger the update per 0.5 second
setInterval(update, 500);