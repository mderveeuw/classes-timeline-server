var Timeline = require("pebble-api").Timeline,
    classes = require("./classes.json"),
    cron = require("node-cron");

var timeline = new Timeline();

var userToken = "SB8edorTdNFrdsaX4sEfP9BVKEZTzZ7o";

var sendPins = function() {
  console.log("COMMENCING PIN PROCESS");

  var i = 0,
      date = new Date(),
      pinTime = date,
      day = date.getDay(),
      dayObj = classes[day];

  function pinLoop() {
    if(i < Object.keys(dayObj).length) {
      var classObj = classes[day][i];

      console.log("\nHANDLING OBJECT: " + JSON.stringify(classObj));

      pinTime.setHours(parseInt(classObj.time.hour));
      pinTime.setMinutes(parseInt(classObj.time.min));
      pinTime.setSeconds(0);

      var pinId = classObj.subject + classObj.time.hour + classObj.time.min;
      pinId = pinId.toLowerCase();

      var pin = new Timeline.Pin({
        id: pinId,
        time: pinTime,
        duration: parseInt(classObj.duration),
        layout: new Timeline.Pin.Layout({
          type: Timeline.Pin.LayoutType.CALENDAR_PIN,
          tinyIcon: Timeline.Pin.Icon.NOTIFICATION_FLAG,
          title: classObj.subject,
          locationName: classObj.location
        })
      });

      console.log("INSERTING PIN IN USER TIMELINE");
      console.log("ID: " + pinId);
      console.log("TIME: " + pinTime);

      timeline.deleteUserPin(userToken, pin, function(error) {
        console.log("DELETING USER PIN");

        if(error) {
          return console.log("ERROR DELETING PIN: " + error);
        }
      });

      setTimeout(function() {timeline.sendUserPin(userToken, pin, function(error) {
        console.log("SENDING USER PIN");

        if(error) {
          return console.log("ERROR SENDING PIN: " + error);
        }
      })}, 1000);

      i++

      setTimeout(pinLoop, 5000);
    }
  }
  pinLoop();
}

cron.schedule("00 00 * * *", function() {
  sendPins();
});

sendPins();
