const express = require("express");
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} = require("../controllers/reviewController");

const {
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router({ mergeParams: true });
// ! we use merge params to have access to tourId param

router.use(protect);

// POST /tour/:tourId/reviews
// POST /reviews

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserId, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
