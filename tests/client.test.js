const request = require("supertest");
const app = require("../app");
require("dotenv").config({ debug: false });

const mongoose = require("mongoose");
const Client = require("../models/Client");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let token;
let userId;

// Connect to MongoDB before running tests
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany();
    await Client.deleteMany();

    // Create admin user
    const user = await User.create({
      name: "Admin Tester",
      email: "admin@test.com",
      password: "123456",
      role: "admin",
    });

    userId = user._id;

    // Generate token
    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.TOKEN_SECRET
    );
  } catch (err) {
    console.error("Error setting up test environment:", err);
  }
}, 20000); // Increase timeout if needed

// Clean db up after tests
afterAll(async () => {
  await User.deleteMany();
  await Client.deleteMany();
  await mongoose.disconnect();
});

// Unit tests for Create Client endpoints
describe("POST /clients", () => {
  it("should create a new client", async () => {
    const newClient = {
      name: "Client 1",
      email: "client1_" + Date.now() + "@gmail.com", // unique email to avoid conflict
      phone: "1234567890",
    };

    const res = await request(app)
      .post("/clients/create")
      .set("Authorization", `Bearer ${token}`)
      .send(newClient);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Client 1");
    expect(res.body.email).toBe(newClient.email);
    expect(res.body.phone).toBe("1234567890");
  });
});
