const mongoose = require("mongoose");

const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudinary");

const Schema = mongoose.Schema;

// Schema that represents images of benches
const imageSchema = new Schema({
  url: String,
  filename: String,
});

// Virtual property that transforms cloudinary image size for edit page
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
// Virtual property that transforms cloudinary image size for bench index and detail page
imageSchema.virtual("resized").get(function () {
  return this.url.replace("/upload", "/upload/w_675,h_450,c_fill");
});

// Schema that represents benches, with address, geographic properties, discription, list of images, rating author, number of reviews and list of reviews
const benchSchema = new Schema({
  address: {
    type: String,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  description: {
    type: String,
    require: true,
  },
  images: [imageSchema],
  rating: {
    sum: Number,
    count: Number,
    average: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews_count: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Virtual property that returns bench address without the country
benchSchema.virtual("shortAddress").get(function () {
  return this.address.replace(/(, Israel)/, "");
});

// If address already exist, throw error with custom message
benchSchema.pre("save", async function () {
  if (this.isModified("address")) {
    console.log("lol");
    const addressExists = await Bench.exists({ address: this.address });
    if (addressExists) {
      throw new ExpressError("This address already exists!", 400);
    }
  }
});

// Mongoose middleware to delete associated reviews and images after deleting a bench
benchSchema.post("findOneAndDelete", async function (bench) {
  // If bench exists
  if (bench) {
    // Require review model
    const Review = require("./review");
    // For each bench image, delete from cloudinary
    for (let image of bench.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
    // Delete all reviews associated with this bench
    await Review.deleteMany({
      _id: {
        $in: bench.reviews,
      },
    });
  }
});

// Create a geospatial index to sort benches by distance
benchSchema.index({ location: "2dsphere" });

// Compile schema to model and export
const Bench = mongoose.model("Bench", benchSchema);
module.exports = Bench;
