const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define Paths For Express Config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup Handlebars Engine and Views Location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set Up Static Directory To Serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'Duane Yaiser'
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		helpText: 'Help, I Need Somebody! Not Just Anybody . . .',
		title: 'Help',
		name: 'Duane Yaiser'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Duane Yaiser'
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'Please Provide Address'
		});
	} else {
		geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
			if (error) {
				return res.send({
					error
				});
			}

			forecast(latitude, longitude, (error, forecastData) => {
				if (error) {
					return res.send({ error });
				}
				res.send({
					forecast: forecastData,
					location,
					address: req.query.address
				});
			});
		});
	}
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'Please provide a search term!'
		});
	}
	console.log(req.query.search);
	res.send({
		products: []
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Duane Yaiser',
		errorMessage: 'Article in "Help" Section Not Found',
		returnURL: '/help',
		returnLocation: 'Help'
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Duane Yaiser',
		errorMessage: 'Page Not Found!',
		returnURL: '/',
		returnLocation: 'Home Page'
	});
});

app.listen(3000, () => {
	console.log('Server is up on port 3000.');
});
