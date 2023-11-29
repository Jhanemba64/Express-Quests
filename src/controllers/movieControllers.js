const database = require("../../database");

const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    color: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    color: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movies]) => {
      // Envoyer la liste des films en tant que réponse JSON
      res.json(movies);
    })
    .catch((err) => {
      // En cas d'erreur, logguer l'erreur et envoyer une réponse avec le code d'erreur 500 (Internal Server Error)
      console.error(err);
      res.sendStatus(500);
    });
};

// BIEN VOIR

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  // Utiliser la méthode query de la base de données pour exécuter une requête SQL SELECT avec une clause WHERE

  database
    .query("select * from movies where id = ?", [id])
    .then((movies) => {
      if (movies != null) {
        // Si trouvé, envoyer le premier film trouvé en tant que réponse JSON
        res.json(movies[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      // En cas d'erreur, logguer l'erreur et envoyer une réponse avec le code d'erreur 500 (Internal Server Error)
      console.error(err);
      res.sendStatus(500);
    });
};

// Définir une fonction pour ajouter un nouveau film à la base de données
const postMovie = (req, res) => {
  // Extraire les données du corps de la requête
  const { title, director, year, color, duration } = req.body;

  // Utiliser la méthode query de la base de données pour exécuter une requête SQL INSERT
  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// Définir une fonction pour mettre à jour les informations d'un film dans la base de données
const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  // Utiliser la méthode query de la base de données pour exécuter une requête SQL UPDATE
  database
    .query(
      "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      // Vérifier si un film a été mis à jour (aucun film trouvé avec cet ID)
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// Exporter les fonctions du contrôleur
module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
};
