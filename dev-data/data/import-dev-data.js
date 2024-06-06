const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./../../config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log("database successfully connected");
});
//read json file

const tours = JSON.parse(fs.readFileSync("tours-simple.json", "utf-8"));

//import data into db

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit(); //agressive way to stop application
};
//delete all data from the database

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  // by writing --import while running the file we add --import to be the 3rd element in process.argv array
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
