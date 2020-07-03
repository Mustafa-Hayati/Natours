const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please, tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please, provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please, provide a valid email!"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please, provide a password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please, confirm your password!"],
    validate: {
      // This only works on CREATE AND SAVE
      validator: function (password) {
        return password === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  // only run if password is modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 13);
  this.passwordConfirm = undefined;
  next();
});

// instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // false means not changed.
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
