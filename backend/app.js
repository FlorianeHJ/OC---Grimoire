const express = require("express");
const app = express();
// const mongoose = require("mongoose");

// mongoose
//   .connect(
//     "mongodb+srv://fjuliadev:P3qtnNA9pDuEaArv@cluster0.x5i0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => console.log("Connexion à MongoDB réussie !"))
//   .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

module.exports = app;
