//? *************** Imports ***************

const fs = require("fs");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

//? *******************************************

//? *************** Middlewares ***************

app.use(express.json());

//? *******************************************
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//? *************** Routes ***************

// @route    GET api/v1/tours
// @desc     Get All tours
// @access   Public

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

// @route    GET api/v1/tours/:id
// @desc     Get One specific tour
// @access   Public

app.get("/api/v1/tours/:id", (req, res) => {
  // you can make a parameter optional by adding
  // question mark (?) after it like :id?
  const { id } = req.params;

  // This is a wrong logic
  if (+id > tours.length)
    return res.status(404).json({
      status: "fail",
      data: {
        msg: "There's no such a tour.",
      },
    });

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
});

// @route    POST api/v1/tours
// @desc     Create one tour
// @access   Private
app.post("/api/v1/tours", (req, res) => {
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
});

// @route    PATCH api/v1/tours/:id
// @desc     Update one tour
// @access   Private

app.patch("/api/v1/tours/:id", (req, res) => {
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
});

//? *******************************************

app.listen(PORT, () =>
  console.log(`Natours server is running on port ${PORT}`)
);
