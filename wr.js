var Pushy = require('pushy');
var pushyAPI = new Pushy('0f7df325d08d4b0613f7c08607b7eb6770557f8a4a98f8f0ac5d455cfc200ddd');
 var data = {
    message: "pushy ud talks"
};

 var tos = "";

const request = require('request');
var d_url = 'http://128.199.222.145/ofline/deviceid.php?gid=1&user=1';
request(d_url, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
tos = body.result
console.log(body.result);
 var to = tos.split(",");
console.log(to.length+"ddd");

var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello World \u270c'
    },
};
 
for (var index = 1; index < to.length; index++) { 
 console.log("hello");
pushyAPI.sendPushNotification(data, to[index], options, function (err, id) {
     if (err) {
        return console.log('Fatal Error', err);
    }
    
    // Log success 
    console.log('Push sent successfully! (ID: ' + id + ')');
});
}

});

