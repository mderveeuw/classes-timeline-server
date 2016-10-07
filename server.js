var Timeline = require("pebble-api").Timeline,
    classes = require("./classes.json"),
    cron = require("node-cron");

var timeline = new Timeline();

var userToken = "SB8edorTdNFrdsaX4sEfP9BVKEZTzZ7o";

var sendPins = function() {
  console.log("\n\n\nStarting daily pin process");

  var date = new Date(),
      day = date.getDay(),
      dayObject = classes[day];

  for(var i = 0; i < Object.keys(dayObject).length; i++)  {
    var classObject = classes[day][i];

    date.setHours(parseInt(classObject.time.hour));
    date.setMinutes(parseInt(classObject.time.min));
    date.setSeconds(0);

    var pinId = classObject.subject + "-" + classObject.time.hour + classObject.time.min + "-" + date.getDate() + date.getMonth();
    pinId = pinId.toLowerCase();

    var pin = new Timeline.Pin({
      id: pinId,
      time: date,
      duration: parseInt(classObject.duration),
      layout: new Timeline.Pin.Layout({
        type: Timeline.Pin.LayoutType.CALENDAR_PIN,
        tinyIcon: Timeline.Pin.Icon.NOTIFICATION_FLAG,
        title: classObject.subject,
        locationName: classObject.location
      })
    });

    timeline.sendUserPin(userToken, pin, function(error) {
      console.log("\nSending pin to user timeline: " +
                  "\n\tid: " + pin.id +
                  "\n\ttime: " + pin.time +
                  "\n\tduration: " + pin.duration +
                  "\n\ttitle: " + pin.layout.title +
                  "\n\tlocationName: " + pin.layout.locationName);

      if(error) {
        return console.log("ERROR SENDING PIN: " + error);
      }
    });
  }
  console.log("\nAll daily pins sent");
}

cron.schedule("00 00 * * *", function() {
  sendPins();
});

sendPins();
