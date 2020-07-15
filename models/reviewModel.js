const mongoose = require("mongoose");
const Tour = require("./tourModel");
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

// static method
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this points to Review
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Preventing duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post("save", function () {
  // the post middleware does not have access to next
  // this points to current reivew
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
