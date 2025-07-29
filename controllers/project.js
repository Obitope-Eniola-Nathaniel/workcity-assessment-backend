const Project = require("../models/Project");
const { validationResult } = require("express-validator");

// Create a new project
exports.createProject = async (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422; // Unprocessable Entity
    return next(error);
  }

  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    // Extract project data from request body
    const { name, description, status, client } = req.body;
    const project = new Project({
      name,
      description,
      status,
      client,
      createdBy: req.user.id,
      startDate: new Date(), // Assuming start date is now
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
    res
      .status(500)
      .json({ message: "Project creation failed", error: error.message });
  }
};

// Get all projects
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email")
      .populate("createdBy", "name email");
    res.status(200).json(projects);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res, next) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId)
      .populate("client", "name email")
      .populate("createdBy", "name email");
    if (!project) {
      const error = new Error("Project not found.");
      error.statusCode = 404; // Not Found
      return next(error);
    }
    res.status(200).json(project);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
  }
};

// Update a project
exports.updateProject = async (req, res, next) => {
  const projectId = req.params.id;
  const { title, description, status, client, startDate, endDate } = req.body;

  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error("Project not found.");
      error.statusCode = 404; // Not Found
      return next(error);
    }

    // Update project details
    project.title = title;
    project.description = description;
    project.status = status;
    project.client = client;
    project.startDate = startDate;
    project.endDate = endDate;
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
  }
};

// Delete a project
exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.id;

  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      const error = new Error("Project not found.");
      error.statusCode = 404; // Not Found
      return next(error);
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
  }
};

// Get projects by client ID
exports.getProjectsByClientId = async (req, res, next) => {
  const clientId = req.params.clientId;

  try {
    // Check if user is authenticated
    if (!req.user) {
      const error = new Error("Not Authenticated.");
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    const projects = await Project.find({ client: clientId })
      .populate("client", "name email")
      .populate("createdBy", "name email");

    if (projects.length === 0) {
      const error = new Error("No projects found for this client.");
      error.statusCode = 404; // Not Found
      return next(error);
    }

    res.status(200).json(projects);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500; // Internal Server Error
    }
    next(error);
  }
};
