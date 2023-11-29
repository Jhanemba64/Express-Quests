// Charger la configuration des variables d'environnement à partir d'un fichier .env
require("dotenv").config();

// Importer le module MySQL2/promise pour la gestion des bases de données MySQL
const mysql = require("mysql2/promise");

// Créer une connexion à la base de données en utilisant la méthode createPool de MySQL2
const database = mysql.createPool({
  host: process.env.DB_HOST, // address of the server
  port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the APP_PORT !
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Exécuter une requête SQL SELECT pour récupérer tous les films de la table "movies"
database
  .query("select * from movies")
  .then((movies) => {
    console.log(movies);
  })
  .catch((err) => {
    console.error(err);
  });

// Exporter la connexion à la base de données pour l'utiliser dans d'autres parties de l'application
module.exports = database;
