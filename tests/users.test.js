const request = require("supertest");
const app = require("../src/app");
const database = require("../database");
const crypto = require("node:crypto");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

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

    // Vérifier que l'utilisateur a été correctement enregistré dans la base de données
    const [result] = await database.query("SELECT * FROM users WHERE id=?", [
      response.body.id,
    ]);

    const [userInDatabase] = result;

    // Assertions sur les propriétés de l'utilisateur enregistré dans la base de données
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
    // N'effectuez jamais d'assertion directe sur le mot de passe stocké dans la base de données
    // vérifier l'authentification lors des tests d'authentification
  });
});
