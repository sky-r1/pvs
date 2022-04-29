const db = require("./db.config.js");
const mongoose = require('mongoose');
// const db_index = require('../models');
// const Role = db_index.role;
const Role = require('../models/Role');

// console.log(db.url);

const connectDB = async () => {
  try {
    await mongoose.connect(
      db.url, 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    // console.log("Connected to the database!");
    console.log('MongoDB Connected...');
    initial();
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
   }
};

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }
        console.log('add "user" to roles collection');
      });
      new Role({
        name: 'moderator'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }
        console.log('add "moderator" to roles collection')
      });
      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }
        console.log('add "admin" to roles collection')
      });
    }
  });
};

module.exports = connectDB;