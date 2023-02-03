// Importing express, path and mongoose
const express = require('express');
const path = require('path');
const mongoose  = require("mongoose");
const Campground = require('./models/campground');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Takes the page to home.ejs
app.get('/', async (req, res) => {
    const camp = new Campground({title:'Frontyard', description:'Cheap'});
    await camp.save();
    res.send(camp)
})

app.get('/makecampground', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})


app.get('/campgrounds/:id', async(req, res) => {
    const campground =  await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground});
})

// Tells express port to go to
app.listen(3000, ()=> {
    console.log('Serving on pot 3000')
});