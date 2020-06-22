const Tour = require("../models/tourModel");

// exports.checkID = (req, res, next, paramValue) => {
//   console.log(`Tour id is ${paramValue}`);
//   //! This logic is wrong
//   if (+req.params.id > tours.length)
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach(el => delete queryObject[el]);

    const query = Tour.find(queryObject);

    const tours = await query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  // you can make a parameter optional by adding
  // question mark (?) after it like :id?
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id).select("-__v");
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // I think it's not safe to let a user put something
    // in the database without validating his/her inputs
    // first
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
      data: {
        tour: null,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
