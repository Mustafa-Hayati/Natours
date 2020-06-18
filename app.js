//? ******** Imports and Initialization ********

const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//? *******************************************

//? *************** Middlewares ***************

app.use(morgan("dev"));
app.use(express.json());

//? *******************************************

//? *************** Controllers ***************
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  // you can make a parameter optional by adding
  // question mark (?) after it like :id?
  const { id } = req.params;

  const tour = tours.find(t => t.id === +id);
  if (!tour)
    return res.status(404).json({
      status: "fail",
      data: {
        msg: "There's no such a tour.",
      },
    });
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  let { id } = req.params;
  id = +id;

  const tourIndex = tours.findIndex(t => t.id === id);
  if (tourIndex === -1)
    return res.status(404).json({
      status: "fail",
      data: {
        msg: "There's no such a tour",
      },
    });

  const updatedTour = {
    ...tours[tourIndex],
    ...req.body,
  };

  tours[tourIndex] = updatedTour;
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(200).json({
        status: "success",
        data: {
          tour: updatedTour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  let { id } = req.params;
  id = +id;

  const tourIndex = tours.findIndex(t => t.id === id);
  if (tourIndex === -1)
    return res.status(404).json({
      status: "fail",
      data: {
        msg: "There's no such a tour",
      },
    });

  tours.splice(tourIndex, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(204).json({
        status: "success",
        data: {
          tour: null,
        },
      });
    }
  );
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      msg: "This route is yet to be implemented.",
    },
  });
};

//? *******************************************

//? *************** Routes ***************

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);

tourRouter
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);

userRouter
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//? *******************************************

app.listen(PORT, () =>
  console.log(`Natours server is running on port ${PORT}`)
);
