# Classes-Timeline-Server
A simple node server using the [pebble-api](https://www.npmjs.com/package/pebble-api) library and an [ical](https://www.npmjs.com/package/ical) parser to push pins to the timeline for my Pebble app Classes.

If you want to use this for your own app, make a `config.json` file with following layout:

```
{
	"userToken": "Your Pebble watch's userToken",
	"icalURL": "Your iCal URL for your timetable"
}
```
