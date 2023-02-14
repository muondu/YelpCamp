// Importing express, path and mongoose
const express = require('express');
const path = require('path');
const mongoose  = require("mongoose");
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schema.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { render } = require('ejs');
const { response } = require('express');
const Review = require('./models/review');
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

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

// Takes the page to home.ejs
app.get('/', async (req, res) => {
    const camp = new Campground({title:'Frontyard', description:'Cheap'});
    await camp.save();
    res.send(camp)
})

app.get('/makecampground',catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));


// Takes you to creating new campground
app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new')   
});

app.get('/campgrounds/:id', catchAsync( async(req, res) => {
    const campground =  await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground});
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.__id}`);

}))

app.delete('/camgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.post('/campgrounds', validateCampground, catchAsync( async(req, res, next) => {
    // if(!req.body.camground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/camp/${campground._id}`)

}))


app.put('campground/:id',validateCampground, catchAsync( async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.camground})
    res.redirect(`/campgrounds/${campground._id}`)

}))

// Takes you to edit campground
app.get('/campground/:id/edit', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('camgrounds/edit', {campground});
}))

app.delete('/campground/id',catchAsync( async (req, res) => {
    const {id} = req.params;
    await Campground.findOneAndDelete(id);
    res.redirect('/campgrounds');
    
}))

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

