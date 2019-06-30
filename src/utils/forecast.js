const request = require('request');

const forecast = (latitude, longitude, callback) => {
	const url =
		'https://api.darksky.net/forecast/ead1c0961549919b3c26a0224710204a/' +
		latitude +
		',' +
		longitude;

	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service!', undefined);
		} else if (body.error) {
			callback('Unable to find location', undefined);
		} else {
			callback(
				undefined,
				body.daily.data[0].summary +
					' It is currently ' +
					body.currently.temperature +
					' degrees out, with a high of ' +
					body.daily.data[0].temperatureHigh +
					' degrees, and a low of ' +
					body.daily.data[0].temperatureLow +
					' degrees. There is a ' +
					body.currently.precipProbability +
					'% chance of rain. ' +
					body.daily.summary
			);
		}
	});
};

module.exports = forecast;
