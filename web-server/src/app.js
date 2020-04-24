const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast.js');

const app = express();

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlerbar engine and view location
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        name: 'home'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'about'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page!',
        message: 'help message!!!',
        name: 'help'
    })
});

app.get('/help/*', (req, res) => {
    res.render('noFound',{
        title: '404',
        name: 'not found',
        noFoundMessage: 'Help article not found'
    })
})

app.get('/product', (req, res) => {
    console.log(req.query);
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        product: []
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error: 'You must provide a address term'
        })
    }

    geocode(address, (err, {latitude, longitude, location} = {}) => {

        if (err) {
            return res.send({
                error: err
            })
        }

        forecast({latitude, longitude}, (err, data) => {

            if (err) {
                return res.send({
                    error: err
                })
            }


            // res.send({
            //     forecast: 'It ia raining',
            //     location: 'GuangZhou',
            //     address: req.query.address
            // })

            res.send({
                forecast: data,
                location,
                address
            })
        })
    });

})

app.get('*', (req, res) => {
    res.render('noFound', {
        title: '404',
        name: 'not found',
        noFoundMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('server is up to port 3000');
});