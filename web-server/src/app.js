const express = require('express');
const path = require('path');
const hbs = require('hbs');

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