const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review most belong to a tour"],
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Review most belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
