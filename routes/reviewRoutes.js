const express = require("express");
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
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
  .post(protect, restrictTo("user"), setTourUserId, createReview);

router.route("/:id").patch(updateReview).delete(deleteReview);

module.exports = router;
