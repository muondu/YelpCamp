const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema, reviewSchema} = require('../schema.js');



const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

router.get('/',catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));

// Takes you to creating new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new')   
});

router.post('/', validateCampground, catchAsync( async(req, res, next) => {
    // if(!req.body.camground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/camp/${campground._id}`)

}))

router.get('/:id', catchAsync( async(req, res) => {
    const campground =  await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground});
}));

// Takes you to edit campground
router.get('/:id/edit', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('camgrounds/edit', {campground});
}))

router.put(':id',validateCampground, catchAsync( async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.camground})
    res.redirect(`/campgrounds/${campground._id}`)

}))



router.delete('/:id',catchAsync( async (req, res) => {
    const {id} = req.params;
    await Campground.findOneAndDelete(id);
    res.redirect('/campgrounds');
    
}))

module.exports = router;   
