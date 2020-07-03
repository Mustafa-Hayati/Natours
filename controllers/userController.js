const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // User.find().sort().select().skip().limit
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};
