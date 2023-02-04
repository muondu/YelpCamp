// Importing express, path and mongoose
const express = require('express');
const path = require('path');
const mongoose  = require("mongoose");
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { render } = require('ejs');
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

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('__method'));

// Takes the page to home.ejs
app.get('/', async (req, res) => {
    const camp = new Campground({title:'Frontyard', description:'Cheap'});
    await camp.save();
    res.send(camp)
})

app.get('/makecampground', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
});

// Takes you to creating new campground
app.get('/campground/new',  (req, res) = {
    res.render('campgrounds/new')
});

app.get('/campgrounds/:id', async(req, res) => {
    const campground =  await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground});
});



app.post('/campgrounds', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/camp/${campground._id}`)
})

// Takes you to edit campground
app.get('/campground/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('camgrounds/edit', {campground});
})

// Tells express port to go to
app.listen(3000, ()=> {
    console.log('Serving on pot 3000')
})

app.put('campground/:id', async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.camground})
    res.redirect(`/campgrounds/${campground._id}`)

})

app.delete('/campground/id', async (req, res) => {
    const {id} = req.params;
    await Campground.findOneAndDelete(id);
    res.redirect('/campgrounds');
    
})