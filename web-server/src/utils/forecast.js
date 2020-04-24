const request = require("request");

const forecast = ({latitude, longitude}, callback) => {

    const url = 'https://api.darksky.net/forecast/c676eb7ebfea9779c1408e7c14f4f3de/'+ latitude +','+ longitude ;

    request({url, json: true}, (err, res, body) => {
        if (err) {
            callback('unexpected, error');
        } else if (body.error) {
            callback('unable to get weather, please try again');
        } else {
            callback(undefined, body.daily.data[0].summary);
        }
    });
}

module.exports = forecast;