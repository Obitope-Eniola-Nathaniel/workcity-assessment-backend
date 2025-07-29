const express = require("express");
const { body } = require("express-validator");
const projectController = require("../controllers/project");
const isAuth = require("../middleware/isAuth");
const role = require("../middleware/role");
console.log("isAuth type:", typeof isAuth);

const router = express.Router();

// Create a new project - admin only
router.post(
  "/create",
  isAuth,
  role("admin"),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("status").trim().notEmpty().withMessage("Status is required"),
    body("client").trim().notEmpty().withMessage("Client is required"),
  ],
  projectController.createProject
);

// Read - All User Projects
router.get("/", isAuth, projectController.getProjects);
router.get("/:id", isAuth, projectController.getProjectById);

// Update - admin only
router.put("/:id", isAuth, role("admin"), projectController.updateProject);

// Delete - admin only
router.delete("/:id", isAuth, role("admin"), projectController.deleteProject);

// Get all projects for a specific client
// router.get("/client/:clientId", isAuth, projectController.getProjectsByClient);

module.exports = router;
