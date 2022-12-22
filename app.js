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

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods','GET, POST');
  res.setHeader('Access-Control-Allow-headers','x-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials',false);
  next();
})  

app.get('/', (req, res) => {
})


const bandRoutes = require("./routes/band");
app.use(express.json());  
app.use("/api/band", bandRoutes);

app.listen(port,() => {
    console.log(`connection port ${port}`)
})