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

reviewSchema.pre(/^find/, function (next) {
  //! The part with lots of problems
  // this.populate({
  //   path: "tour",
  //   select:
  //     "-_id -createdAt -startLocation -ratingsAverage -ratingsQuantity -images -startDates -guides -duration -maxGroupSize -durationWeeks -difficulty -price -summary -imageCover -locations -slug -id -__v",
  // }).populate({
  //   path: "user",
  //   select: "-_id -role -email -__v",
  // });
  //? this works fine
  this.populate({
    path: "user",
    select: "-role -email -__v",
  });
  // this.populate("user").populate("tour");

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
