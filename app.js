// Importing express, path and mongoose
const express = require('express');
const path = require('path');
const mongoose  = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
// Connecting all my routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


// Connecting Mongoose DB to app.js
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
// Checks for database connection Error.
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

// Calling express
const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('__method'));




// Takes the page to home.ejs
app.get('/', async (req, res) => {
    const camp = new Campground({title:'Frontyard', description:'Cheap'});
    await camp.save();
    res.send(camp)
})




app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)








// Places that shows you error

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if (!err.message) err.message = 'Oh No, Something went wrong'
    res.status(statusCode).render('error',{ err });
})


// Tells express port to go to
app.listen(3000, ()=> {
    console.log('Serving on pot 3000')
})

