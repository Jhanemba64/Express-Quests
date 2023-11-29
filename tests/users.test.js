const request = require("supertest");
const app = require("../src/app");
const crypto = require("node:crypto");
const database = require("../database");

// Tests pour la route GET /api/users

describe("GET /api/users", () => {
  it("should return all users", async () => {
    // Effectuer une requête GET sur la route /api/users

    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

// Tests pour la route GET /api/users/:id

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    // Effectuer une requête GET sur la route /api/users/1
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

// Tests pour la route POST /api/users

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    // Envoyer une requête POST pour créer un nouvel utilisateur
    const response = await request(app).post("/api/users").send(newUser);

    // Assertions sur la réponse HTTP
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    // Vérif que l'utilisateur a été bien enregistré dans la BDD
    const [result] = await database.query("SELECT * FROM users WHERE id=?", [
      response.body.id,
    ]);

    const [userInDatabase] = result;

    // Assertions utilisateur again
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastName).toStrictEqual(newUser.lastname);
    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(newUser.email);
    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(newUser.city);
    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(newUser.language);
  });
  it("should return an error", async () => {
    // Créer un utilisateur avec des propriétés manquantes
    const userWithMissingProps = { firstname: "Harry" };

    // Effectuer une requête POST avec un utilisateur incomplet
    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });
});

// Tests pour la route PUT /api/users/:id

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Baptou",
      lastname: "Fragile",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Lyon",
      language: "Francais",
    };

    // Insérer un nouvel utilisateur dans la base de données

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Baptou",
      lastname: "Fragile",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Bayonne",
      language: "France",
    };

    // Envoyer une requête PUT pour mettre à jour l'utilisateur

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    // Assertions sur la réponse HTTP

    expect(response.status).toEqual(204);

    // Vérif que l'utilisateur a été correctement mis à jour dans la bdd

    const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [userInDatabase] = users;

    // Assertions propriétés utilisateur mis à jour dans la bdd

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updatedUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updatedUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updatedUser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };

    // Effectuer une requête PUT avec un utilisateur incomplet

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Yohan",
      lastname: "Liberts",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Dublin",
      language: "English",
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);
  });
});
afterAll(() => database.end());
