const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/notevault.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("failed to connect to the database", err.message);
  } else {
    console.log("connected to the databse succesfully");
  }
});

module.exports= db;
