const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route("/top-five-tours")
  .get(tourController.alias, tourController.getAllTours); //using middleware to prefil the query

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/")
  .get(authController.protect,tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

module.exports = router;
