const express = require('express');
const router = express.Router();
const camgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage})

const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(camgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(camgrounds.createCampground));
   
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    // Shows the campground
    .get(catchAsync(camgrounds.showCampground))
    // Used to update Campground
    .put(isLoggedIn ,isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    // Used to delete campground
    .delete(isAuthor ,isLoggedIn,catchAsync(camgrounds.deleteCampground))



// Takes you to creating new campground



// Takes you to edit campground
router.get('/:id/edit', isLoggedIn , isAuthor, catchAsync(camgrounds.renderEditForm));



module.exports = router;   
