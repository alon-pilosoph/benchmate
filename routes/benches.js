const express = require("express");
const multer = require("multer");

const benches = require("../controllers/benches");
const catchAsync = require("../utils/catchAsync");
const {
  loginRequired,
  isBenchAuthor,
  validateBench,
} = require("../middleware");
const { storage } = require("../cloudinary");

const router = express.Router();

// Set up multer to work with cloud storage
// Limit file size to 5MB and 5 files per upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5000000,
    files: 5,
  },
});

router
  .route("/")
  .get(catchAsync(benches.index))
  .post(
    loginRequired,
    upload.array("images"),
    validateBench,
    catchAsync(benches.createBench)
  );

router.get("/new", loginRequired, benches.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(benches.showBench))
  .put(
    loginRequired,
    isBenchAuthor,
    upload.array("images"),
    validateBench,
    catchAsync(benches.editBench)
  )
  .delete(loginRequired, isBenchAuthor, catchAsync(benches.deleteBench));

router.get(
  "/:id/edit",
  loginRequired,
  isBenchAuthor,
  catchAsync(benches.renderEditForm)
);

module.exports = router;
