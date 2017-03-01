var Timeline = require("pebble-api").Timeline,
	ical = require("ical"),
	cron = require("node-cron"),
	config = require("./config.json");

var timeline = new Timeline();

var userToken = config.userToken;

function sendPins(classes) {
	for(var c in classes)  {
		var id = classes[c].summary.substring(0, 16) + "-"
		  + classes[c].start.getHours() + classes[c].start.getMinutes()
		  + "-" + classes[c].start.getDate() + classes[c].start.getMonth()
		  + classes[c].start.getFullYear();

		var pin = new Timeline.Pin({
			id: id,
			time: classes[c].start,
			duration: (classes[c].end - classes[c].start) / 60000,
			layout: new Timeline.Pin.Layout({
				type: Timeline.Pin.LayoutType.CALENDAR_PIN,
				tinyIcon: Timeline.Pin.Icon.NOTIFICATION_FLAG,
				title: classes[c].summary,
				locationName: classes[c].location
			})
		});

		timeline.sendUserPin(userToken, pin, function(error) {
			if(error) {
				console.log("ERROR SENDING PIN: " + error);
			} else {
				console.log("Sent pin:");
				console.log(pin)
			}
		});
	}
}

function getClasses() {
	var classes = [];
	var today = new Date();
	return new Promise(function(resolve, reject) {
		ical.fromURL(config.icalURL, {}, function(err, data) {
			if(err) {
				reject(err);
			}
			for(var d in data) {
				if(data.hasOwnProperty(d) && 'start' in data[d]) {
					if(today.getDate() === data[d].start.getDate()
					  && today.getMonth() === data[d].start.getMonth()
					  && today.getFullYear() === data[d].start.getFullYear()) {
						classes.push(data[d]);
					}
				}
			}
			resolve(classes);
		});
	});
}

cron.schedule("0 0 * * *", function() {
	getClasses().then(function(classes) {
		sendPins(classes);
	}).catch(function(err) {
		console.log(err);
	});
});
