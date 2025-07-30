const request = require("supertest");
const app = require("../app");
require('dotenv').config();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Project = require("../models/Project");
const Client = require("../models/Client");
const User = require("../models/User");

let token;
let projectId;
let clientId;
let userId;

jest.setTimeout(30000); 

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    // Clear DB
    await User.deleteMany();
    await Client.deleteMany();
    await Project.deleteMany();

    // Create admin user
    const user = await User.create({
      name: "Admin Tester",
      email: "admin" + Date.now() + "@test.com", // make unique
      password: "password123456",
      role: "admin",
    });

    // Login with token and asign to userId
    userId = user._id;
    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.TOKEN_SECRET
    );

    // Create client
    const client = await Client.create({
      name: "Test Client",
      email: "client" + Date.now() + "@gmail.com",
      phone: "08012345678",
      createdBy: user._id,
    });

    clientId = client._id;

    // Create project
    const project = await Project.create({
      title: "Original Project",
      description: "Initial description",
      status: "Not started",
      client: clientId,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-08-01"),
      createdBy: user._id,
    });

    projectId = project._id;
  } catch (err) {
    console.error("Error in beforeAll:", err);
  }
});

// Clean up
afterAll(async () => {
  await User.deleteMany();
  await Client.deleteMany();
  await Project.deleteMany();
  await mongoose.disconnect();
});

// Unit tests for Update Project endpoints
describe("PUT /projects/:id", () => {
  it("should update a project successfully", async () => {
    // Update payload
    const updatedProject = {
      title: "Updated Title",
      description: "Updated description",
      status: "In progress",
      client: clientId.toString(),
      startDate: "2025-07-01",
      endDate: "2025-08-01",
    };
    const res = await request(app)
      .put(`/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProject);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
    expect(res.body.description).toBe("Updated description");
    expect(res.body.status).toBe("In progress");
    expect(res.body.client).toBe(clientId.toString());
  });
});
