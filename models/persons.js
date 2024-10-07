const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

const personsschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  }
  
});

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("error connecting to mongo db ", err);
    process.exit(1);
  });

module.exports = mongoose.model("Person", personsschema);
