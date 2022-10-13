const express = require("express");
const { connectDatabase } = require("./db");
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('./utils/passport');
const PORT = process.env.PORT || 3030;

connectDatabase()

const app = express();


// app.use(express.json({ extended: true }));

app.use(bodyParser.json({ limit: '7000mb' }));
app.use(bodyParser.urlencoded({ limit: '7000mb', extended: true }));

// app.use(express.limit(100000000));

app.use(morgan('dev'));

app.use(cookieSession({
    name: 'session',
    keys: ['sea-explorer-nft'],
    maxAge: 48 * 60 * 60 * 100
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));




app.get('/api/v1', (req, res) => {
    return res.send({
        Error: false,
        message: 'Health 100%'
    })
});

app.use('/api/v1', require('./routes/index'));


app.use('*', (req, res) => {
    res.send({
        Error: true,
        message: 'api not found'
    });
});



app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT} and Enviroment: ${process.env.NODE_ENV}`)
}) 