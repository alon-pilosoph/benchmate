const mongoose = require("mongoose");

const Bench = require("../models/bench");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudinary");

// Set up geocoding
const nodeGeocoder = require("node-geocoder");
const geocoder = nodeGeocoder({
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.MAPS_PRIVATE_API_KEY,
  formatter: null,
});

// Controller that renders the bench index page
module.exports.index = async (req, res) => {
  const { sortby } = req.query;
  let benches;
  // Sort benches according to query string
  switch (sortby) {
    case "address":
      benches = await Bench.find({}).sort({ address: "asc" });
      break;
    case "rating":
      benches = await Bench.find({}).sort({ "rating.average": "desc" });
      break;
    case "reviews":
      benches = await Bench.find({}).sort({ reviews_count: "desc" });
      break;
    case "distance":
      try {
        const lng = parseFloat(req.query.lng);
        const lat = parseFloat(req.query.lat);
        benches = await Bench.find({})
          .where("location")
          .near({ center: { type: "Point", coordinates: [lng, lat] } });
      } catch (e) {
        req.flash(
          "danger",
          "Failed to sort by distance. Make sure location access is allowed."
        );
        return res.redirect("/benches");
      }
      break;
    default:
      benches = await Bench.find({});
  }

  res.render("benches/index", { benches });
};

// Controller that renders a form to create a new bench
module.exports.renderNewForm = (req, res) => {
  // If there is a bench description session variable, pass it to the template and delete it
  const description = req.session.description;
  delete req.session.description;
  res.render("benches/new", { description });
};

// Controller that handles creation of new benches
module.exports.createBench = async (req, res) => {
  // Save bench description as session variable, in case of error
  req.session.description = req.body.description;
  // Create a new bench with form data
  const bench = new Bench({ description: req.body.description });
  // Retrieve image upload data
  if (req.files) {
    // Set bench images to array of imageSchema
    bench.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
  }
  // Set bench author to current authenticated user
  bench.author = req.user._id;
  // Initialize rating stats
  bench.rating = { sum: 0, count: 0, average: 0 };

  // Geocode bench address
  try {
    const geolocation = await geocoder.geocode(req.body.address);
    // If geocoder returns empty array, throw error
    if (!geolocation.length)
      throw new ExpressError("Invalid bench address", 400);
    // Set formatted address and coordinates of bench
    bench.address = geolocation[0].formattedAddress;
    bench.location = {
      type: "Point",
      coordinates: [geolocation[0].longitude, geolocation[0].latitude],
    };
  } catch (e) {
    req.flash("danger", "Error locating bench address");
    return res.redirect("/benches/new");
  }

  await bench.save();

  // After bench is saved, remove bench description from session variables
  delete req.session.description;
  req.flash("success", "Successfully added a new bench");
  // Redirect to new bench page
  res.redirect(`/benches/${bench._id}`);
};

// Controller that renders a page with bench details
module.exports.showBench = async (req, res) => {
  // Retrieve id from url and query for bench
  const { id } = req.params;
  // Make sure id can be cast to ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("danger", "Cannot find that bench");
    res.redirect("/benches");
  }

  // Populate bench author, reviews and authors of reviews
  const bench = await Bench.findById(id)
    .populate("author")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });
  // If no bench was found, flash and redirect
  if (!bench) {
    req.flash("danger", "Cannot find that bench");
    res.redirect("/benches");
  }

  res.render("benches/show", { bench });
};

// Controller that renders a form to edit an existing bench
module.exports.renderEditForm = async (req, res) => {
  // Retrieve id from url and query for bench
  const { id } = req.params;
  // Make sure id can be cast to ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("danger", "Cannot find that bench");
    res.redirect("/benches");
  }

  const bench = await Bench.findById(id);
  // If no bench was found, flash and redirect
  if (!bench) {
    req.flash("danger", "Cannot find that bench");
    res.redirect("/benches");
  }

  // Pass bench object to template and render
  res.render("benches/edit", { bench });
};

// Controller that handles updating of existing benches
module.exports.editBench = async (req, res) => {
  // Retrieve id from url and query for bench
  const { id } = req.params;
  const bench = await Bench.findById(id);

  // Assign form data to bench
  bench.description = req.body.description;

  // Geocode bench address
  try {
    const geolocation = await geocoder.geocode(req.body.address);
    // If geocoder returns empty array, throw error
    if (!geolocation.length)
      throw new ExpressError("Invalid bench address", 400);
    // Set formatted address and coordinates of bench
    bench.address = geolocation[0].formattedAddress;
    bench.location = {
      type: "Point",
      coordinates: [geolocation[0].longitude, geolocation[0].latitude],
    };
  } catch (e) {
    req.flash("danger", "Error locating bench address");
    return res.redirect("/benches/new");
  }

  // Retrieve image uploads and push to list of bench images
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  bench.images.push(...imgs);

  // If any images were marked to delete
  if (req.body.deleteImages) {
    // For every filename makred to delete, remove from Cloudinary
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    // Remove from list of bench images all the images whose filename is listed in the form
    await bench.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  await bench.save();

  // Flash and redirect to page of edited bench
  req.flash("success", `Successfully updated bench`);
  res.redirect(`/benches/${bench._id}`);
};

// Controller that handles bench deletion
module.exports.deleteBench = async (req, res) => {
  // Retrieve id from url and delete bench
  const { id } = req.params;
  const bench = await Bench.findByIdAndDelete(id);

  // Flash and redirect to bench index page
  req.flash("success", `Successfully deleted bench`);
  res.redirect("/benches");
};
