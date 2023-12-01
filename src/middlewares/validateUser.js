const validateUser = (req, res, next) => {
  const { firstname, lastname, email, city, language } = req.body;
  const errors = [];
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+.[a-z]{2,3}/;

  if (firstname == null) {
    errors.push({ field: "firstname", message: "This field is required" });
  } else if (typeof firstname !== "string") {
    errors.push({
      field: "firstname",
      message: "This type of field is not correct",
    });
  } else if (firstname.length >= 255) {
    errors.push({
      field: "firstname",
      message: "Should contain less than 255 characters",
    });
  }
  if (lastname == null) {
    errors.push({ field: "lastname", message: "This field is required" });
  } else if (typeof lastname !== "string") {
    errors.push({
      field: "lastname",
      message: "This type of field is not correct",
    });
  } else if (lastname.length >= 255) {
    errors.push({
      field: "lastname",
      message: "Should contain less than 255 characters",
    });
  }

  if (email == null) {
    errors.push({ field: "year", message: "This field is required" });
  } else if (typeof email !== "string") {
    errors.push({
      field: "email",
      message: "This type of field is not correct",
    });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Invalid email" });
  } else if (email.length >= 255) {
    errors.push({
      field: "email",
      message: "Should contain less than 255 characters",
    });
  }
  if (typeof city !== "string") {
    errors.push({
      field: "city",
      message: "This type of field is not correct",
    });
  } else if (city.length >= 255) {
    errors.push({
      field: "city",
      message: "Should contain less than 255 characters",
    });
  }
  if (typeof language !== "string" && typeof language !== null) {
    errors.push({
      field: "language",
      message: "This type of field is not correct",
    });
  } else if (language.length >= 255) {
    errors.push({
      field: "language",
      message: "Should contain less than 255 characters",
    });
  }

  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    next();
  }
};

module.exports = validateUser;
