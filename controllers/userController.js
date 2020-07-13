const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
} = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is not defined. Please use /signup instead",
    },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // 1. create error if user POSTs password data
  if (password || passwordConfirm) {
    return next(
      new AppError(
        `This route is not for password update. Please use /updateMyPassword`,
        400
      )
    );
  }
  // 2.filter our unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3. update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllUsers = getAll(User);

exports.getUser = getOne(User);

//! DON'T UPDATE PASSWORDS WITH THIS
exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);
