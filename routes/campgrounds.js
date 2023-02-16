const express = require('express');
const router = express.Router();
const camgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

const Campground = require('../models/campground');
const campground = require('../models/campground');




router.get('/',catchAsync(camgrounds.index));

// Takes you to creating new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', validateCampground, catchAsync(camgrounds.createCampground));

// Shows the campground
router.get('/:id',catchAsync(camgrounds.showCampground));

// Takes you to edit campground
router.get('/:id/edit', isLoggedIn , isAuthor, catchAsync(camgrounds.renderEditForm));
// Used to update Campground
router.put(':id',  isLoggedIn ,isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));


// Used to delete campground
router.delete('/:id', isAuthor ,isLoggedIn,catchAsync(camgrounds.deleteCampground));

module.exports = router;   
