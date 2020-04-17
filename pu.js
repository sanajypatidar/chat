var Pushy = require('pushy');
 
// Plug in your Secret API Key 
// Get it here: https://dashboard.pushy.me/ 
var pushyAPI = new Pushy('0f7df325d08d4b0613f7c08607b7eb6770557f8a4a98f8f0ac5d455cfc200ddd');
 
// Set push payload data to deliver to device(s) 
var data = {
    message: 'Hello World!'
};
 
// Insert target device token(s) here 
var to = ['a8d438c7144809664326ac','fce4f77bfa7b2102e7d593'];

// Optionally, send to a publish/subscribe topic instead
// to = '/topics/news';
 
// Set optional push notification options (such as iOS notification fields)
var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello World \u270c'
    },
};
 
// Send push notification via the Send Notifications API 
// https://pushy.me/docs/api/send-notifications 
pushyAPI.sendPushNotification(data, to, options, function (err, id) {
    // Log errors to console 
    if (err) {
        return console.log('Fatal Error', err);
    }
    
    // Log success 
    console.log('Push sent successfully! (ID: ' + id + ')');
});
