const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, paramValue) => {
  console.log(`Tour id is ${paramValue}`);
  //! This logic is wrong
  if (+req.params.id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  next();
};

exports.checkBody = (req, res, next) => {
  const { body } = req;
  if (!body.name || !body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  // you can make a parameter optional by adding
  // question mark (?) after it like :id?
  const { id } = req.params;

  const tour = tours.find(t => t.id === +id);
  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "There's no such a tour.",
    });
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  let { id } = req.params;
  id = +id;

  const tourIndex = tours.findIndex(t => t.id === id);
  if (tourIndex === -1)
    return res.status(404).json({
      status: "fail",
      message: "There's no such a tour",
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

exports.deleteTour = (req, res) => {
  let { id } = req.params;
  id = +id;

  const tourIndex = tours.findIndex(t => t.id === id);
  if (tourIndex === -1)
    return res.status(404).json({
      status: "fail",
      message: "There's no such a tour",
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
