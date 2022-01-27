require('dotenv').config()
const express = require('express');
const app = express();
const mongoose=require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser');


//setting bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//Serving Static files
app.use(express.static('public'));

//Ejs initialization
app.set('view engine', 'ejs');

//Mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/UDEMYCLONE-MASTER', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }, () => {
    console.log("Connected to database");
});

//for storing sessions
const mongoDBStore = require('connect-mongodb-session')(session);
const store = new mongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/UDEMYCLONE-MASTER',
    collection: 'sessions'
})

//session intialization
app.set('trust proxy', 1)
app.use(session({
    secret: 'abcd',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        //remeber to set this to true when in production
        secure: false,
        maxAge: 60 * 60 * 1000 //1 hour
    }
}))

const routes = require('./routes/routes')

app.use('/', routes)

//404 page
app.use((req, res) => {
    res.send('404 error');
  })


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started")
})