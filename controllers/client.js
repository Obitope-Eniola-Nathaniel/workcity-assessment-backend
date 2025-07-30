const { validationResult } = require("express-validator");
const Client = require("../models/Client");
const Project = require("../models/Project");

// Create a new client
exports.createClient = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errors = new Error("Validation failed, entered data is incorrect.");
      errors.statusCode = 422; // Unprocessable Entity
      throw errors;
    }

    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // Extract client data from request body
    const { name, email, phone } = req.body;
    const client = new Client({
      name,
      email,
      phone,
      createdBy: req.user.userId,
    });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
    // you can log the error for debugging purposes
    console.error(error);
    res
      .status(500)
      .json({ message: "Creating Client Failed", error: error.message });
  }
};

// Get all clients
exports.getClients = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const clients = await Client.find().populate("createdBy", "name email");
    res.status(200).json(clients);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
    // you can log the error for debugging purposes
    console.error(error);
    res
      .status(500)
      .json({ message: "Fetching Clients Failed", error: error.message });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res, next) => {
  const clientId = req.params.id;

  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const client = await Client.findById(clientId);
    if (!client) {
      const error = new Error("Client not found.");
      error.statusCode = 404; // Not Found
      throw error;
    }
    const projects = await Project.find({ client: client._id });

    res.status(200).json({ client, projects });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
    // log the error for debugging purposes
    console.error(error);
    res
      .status(500)
      .json({ message: "Fetching Client Failed", error: error.message });
  }
};

// Update a client by ID
exports.updateClient = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const clientId = req.params.id;

  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const client = await Client.findById(clientId);
    if (!client) {
      const error = new Error("Client not found.");
      error.statusCode = 404; // Not Found
      throw error;
    }

    // Update client details
    client.name = name;
    client.email = email;
    client.phone = phone;
    await client.save();

    res.status(200).json(client);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
    //log the error for debugging purposes
    console.error(error);
    res
      .status(500)
      .json({ message: "Updating Client Failed", error: error.message });
  }
};

// Delete a client by ID
exports.deleteClient = async (req, res, next) => {
  const clientId = req.params.id;

  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const client = await Client.findById(clientId);
    if (!client) {
      const error = new Error("Client not found.");
      error.statusCode = 404; // Not Found
      throw error;
    }

    await Client.findByIdAndDelete(req.params.id);

    res.status(204).json({ message: "Client deleted successfully." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
    // log the error for debugging purposes
    console.error(error);
    res
      .status(500)
      .json({ message: "Deleting Client Failed", error: error.message });
  }
};
