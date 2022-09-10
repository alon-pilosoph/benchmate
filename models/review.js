const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema that represents a user review for a bench, with rating, headline, body and author
const reviewSchema = new Schema({
  rating: Number,
  headline: String,
  body: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bench: {
    type: Schema.Types.ObjectId,
    ref: "Bench",
  },
});

// Mongoose middleware to update the average review of a bench after a review is saved
reviewSchema.post("save", async function (review) {
  // If review has a rating
  if (review.rating) {
    const bench = review.bench;
    // Update the number of reviews of the bench
    bench.reviews_count++;
    // Update the average rating of the bench
    bench.rating.sum += review.rating;
    bench.rating.count++;
    bench.rating.average = bench.rating.sum / bench.rating.count;
    // Save bench
    await bench.save();
  }
});

// Mongoose middleware to update the average review of a bench after a review is deleted
reviewSchema.post("findOneAndDelete", async function (review) {
  // If review exists and has a rating
  if (review && review.rating) {
    // Require bench model
    const Bench = require("./bench");
    // Query the db for the bench of this review
    const bench = await Bench.findById(review.bench);
    // Update the number of reviews of the bench
    bench.reviews_count--;
    // Update the average rating of the bench
    bench.rating.sum -= review.rating;
    bench.rating.count--;
    bench.rating.average =
      bench.rating.count == 0 ? 0 : bench.rating.sum / bench.rating.count;
    // Save bench
    await bench.save();
  }
});

// Compile schema to model and export
module.exports = mongoose.model("Review", reviewSchema);
