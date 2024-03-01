const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// here the map function returns a new array with transformed values
// map will add a new property called "owner" in every individual listing we have in our array
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner : "65cfc6ae0cd38afafc5f5251"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();