const express = require("express");
const {
  getAllReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router({ mergeParams: true });
// ! we use merge params to have access to tourId param

// POST /tour/:tourId/reviews
// POST /reviews

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").delete(deleteReview);

module.exports = router;
