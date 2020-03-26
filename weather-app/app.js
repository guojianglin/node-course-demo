const request = require('request');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast.js');

const address = process.argv[2];

if (!address) {
    console.log('please provide an address!');
} else {
    geocode(address, (err, data) => {

        if (err) {
            return console.log(err);
        }

        forecast(data, (err, data) => {

            if (err) {
                return console.log(err);
            }

            console.log('Error:', err);
            console.log('Data:', data);
        })
    });
}


