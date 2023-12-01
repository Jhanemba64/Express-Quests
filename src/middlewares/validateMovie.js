// Fonction middleware pour valider les données d'un film avant traitement

const validateMovie = (req, res, next) => {
  // Extraire les données du film du corps de la requête
  const { title, director, year, color, duration } = req.body;
  // Tableau pour stocker les erreurs de validation
  const errors = [];

  // Valider le champ 'title'

  if (title == null) {
    errors.push({ field: "title", message: "This field is required" });
  } else if (title.length >= 255) {
    errors.push({
      field: "title",
      message: "Should contain less than 255 characters",
    });
  }

  // Valider le champ 'director'

  if (title == null) {
    errors.push({ field: "title", message: "This field is required" });
  }
  if (director == null) {
    errors.push({ field: "director", message: "This field is required" });
  }
  if (year == null) {
    errors.push({ field: "year", message: "This field is required" });
  }
  if (color == null) {
    errors.push({ field: "color", message: "This field is required" });
  }
  if (duration == null) {
    errors.push({ field: "duration", message: "This field is required" });
  }

  // S'il y a des erreurs, renvoyer une réponse avec le code d'erreur 422 (Unprocessable Entity)

  if (errors.length) {
    // S'il n'y a pas d'erreurs, passer au middleware suivant
    res.status(422).json({ validationErrors: errors });
  } else {
    next();
  }
};

module.exports = validateMovie;
