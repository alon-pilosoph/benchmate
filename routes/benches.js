const express = require('express');
const router = express.Router();

// Set up multer to work with cloud storage
const multer = require('multer');
const { storage } = require('../cloudinary');
// Limit file size to 1MB and 5 files per upload
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000,
        files: 5
    }
});

const benches = require('../controllers/benches');
const { loginRequired, isBenchAuthor, validateBench } = require('../middleware');
const catchAsync = require('../utils/catchAsync');



router.route('/')
    .get(catchAsync(benches.index))
    .post(loginRequired, upload.array('images'), validateBench, catchAsync(benches.createBench));

router.get('/new', loginRequired, benches.renderNewForm);

router.route('/:id')
    .get(catchAsync(benches.showBench))
    .put(loginRequired, isBenchAuthor, upload.array('images'), validateBench, catchAsync(benches.editBench))
    .delete(loginRequired, isBenchAuthor, catchAsync(benches.deleteBench));

router.get('/:id/edit', loginRequired, isBenchAuthor, catchAsync(benches.renderEditForm));

module.exports = router;