const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');





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

// Shows the campground
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
router.get('/:id/edit', isLoggedIn , isAuthor, catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }

    res.render('camgrounds/edit', {campground});
}))
// Used to update Campground
router.put(':id',  isLoggedIn ,isAuthor, validateCampground, catchAsync( async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equal(req.user._id)) {
        req.flash('success', 'Successfully updated Campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    } 
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.camground})
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)

}))


// Used to delete campground
router.delete('/:id', isAuthor ,isLoggedIn,catchAsync( async (req, res) => {
    
    const {id} = req.params;
    await Campground.findOneAndDelete(id);
    req.flash('success', 'Successfully deleted  campground!');
    res.redirect('/campgrounds');
    
}))

module.exports = router;   
