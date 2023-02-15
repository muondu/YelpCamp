const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema, reviewSchema} = require('../schema.js');
const {isLoggedIn} = require('../middleware');



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
router.get('/new', isLoggedIn, (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in');
        // We have put return so this code runs before the code after
        return res.redirect('/login');
    }
    res.render('campgrounds/new')   
});

router.post('/', validateCampground, catchAsync( async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`/campgrounds/camp/${campground._id}`)

}))

router.get('/:id',catchAsync( async(req, res) => {
    const campground =  await Campground.findById(req.params.id).populate('reviews').populate('reviews').populate('author');
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}));

// Takes you to edit campground
router.get('/:id/edit', isLoggedIn , catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('camgrounds/edit', {campground});
}))

router.put(':id',  isLoggedIn ,validateCampground, catchAsync( async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.camground})
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)

}))



router.delete('/:id', isLoggedIn,catchAsync( async (req, res) => {
    const {id} = req.params;
    await Campground.findOneAndDelete(id);
    req.flash('success', 'Successfully deleted  campground!');
    res.redirect('/campgrounds');
    
}))

module.exports = router;   
