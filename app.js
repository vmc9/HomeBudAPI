const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const petRoutes = require('./api/routes/pet');
const searchRoutes = require('./api/routes/search');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://dbAdmin:'+process.env.MONGO_ATLAS_PW+'@cluster0-y8qoc.gcp.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({
            Message: "Working"
        });
    }
    next();
});

//Routes setup
app.use('/pets', petRoutes);
app.use('/search', searchRoutes);
app.use('/users', userRoutes);

//Catch 404 Errors from this API
app.use((reg, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Catch all other errors (DB, etc)
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;