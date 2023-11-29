require("dotenv").config();

const port = process.env.APP_PORT;

const express = require("express");

const app = express();

app.use(express.json());

const movieControllers = require("./controllers/movieControllers");
const userControllers = require("./controllers/userControllers");

//Récuperer

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUsersById);

// Créer

app.post("/api/movies", movieControllers.postMovie);
app.post("/api/users", userControllers.createUser);

// Mettre à jour

app.put("/api/movies/:id", movieControllers.updateMovie);
app.put("/api/users/:id", userControllers.updateUsers);

module.exports = app;
