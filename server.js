const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
  console.log(`Uncaught Exception 💣 Shutting down the server... `);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

let DB;
// if (process.env.NODE_ENV === "production") {
//   //! MongoDB Atlas
//   DB = process.env.DATABASE.replace(
//     "<PASSWORD>",
//     process.env.DATABASE_PASSWORD
//   );
// } else {
//   // ! Local Database
//   DB = process.env.DATABASE_LOCAL;
// }

DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"));

const app = require("./app");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Natours server is running on port ${PORT}`)
);

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log(`Unhandled Rejection 💣 Shutting down the server... `);
  server.close(() => {
    process.exit(1);
  });
});
