const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
  console.log(`It's dev environment baby`);
  // console.log(JSON.stringify(process.env.NODE_ENV));
  // console.log(app.get("env"));
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 3600000, // 1 hour
  message:
    "Too many requests from this IP, please try again in an hour.",
});

app.use("/api", limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

// 4 parameters means error handling middleware
app.use(globalErrorHandler);

module.exports = app;
