/**
 * Created by stone.chao on 20/04/17.
 */
function handler(){
    const milliseconds = new Date().getTime();
    document.getElementById("map").innerHTML = "hello world! Now is " + milliseconds;
}
setInterval(handler, 500);