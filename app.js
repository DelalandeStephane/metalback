const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require("./config/database.config.js");

const app = express();
const port = 3000;

mongoose
  .connect(dbConfig.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to the database");
  })
  .catch((err) => {
    console.log("The server cannot connect to the database "+err);
    process.exit();
  });

app.get('/', (req, res) => {
    res.send('Hellow you');
})


const bandRoutes = require("./routes/band");

app.use("/api/band", bandRoutes);

app.listen(port,() => {
    console.log(`connection port ${port}`)
})