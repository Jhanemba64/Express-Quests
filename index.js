// Importer le module app qui contient la configuration d'Express et les routes de l'application
const app = require("./src/app");

const port = 5000;

// Démarrer le serveur en écoutant sur le port spécifié
app
  .listen(port, () => {
    console.log(`Server is listening on ${port}`);
  })
  .on("error", (err) => {
    console.error("Error:", err.message);
  });
