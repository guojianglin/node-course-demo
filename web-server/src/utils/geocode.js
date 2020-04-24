const request = require('request');


const geocode = (address, callback) => {
    const addressUrl = encodeURIComponent(address);
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + addressUrl + '.json?access_token=pk.eyJ1IjoicGV0ZXJndW8iLCJhIjoiY2s4NXdvd3d1MDBhZTNsbnhpbHk1NGd2YiJ9.tFOk7_iFw98GnWdDgKauGg';

    request({url, json: true}, (err, res, { features }) => {
        if (err) {
            callback('unexpected error');
        } else if (features.length === 0) {
            callback('unable to get location, please try again');
        } else {
            callback(undefined, {
                latitude: features[0].center[1],
                longitude: features[0].center[0],
                location: features[0].place_name,
            })
        }
    })
}

module.exports = geocode;