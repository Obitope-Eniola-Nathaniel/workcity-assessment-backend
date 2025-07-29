const express = require("express");
const { body } = require("express-validator");
const clientController = require("../controllers/client");
const isAuth = require("../middleware/isAuth");
const role = require("../middleware/role");

const router = express.Router();

// Create a new client - Only Admins can create clients
// POST http://localhost:5000/clients/create
router.post(
  "/create",
  isAuth,
  role("admin"),

  [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Invalid email address."),
    body("phone").notEmpty().withMessage("Phone number is required."),
  ],
  clientController.createClient
);

// Get all clients - Only authenticated users can access this route
// GET http://localhost:5000/client/
router.get("/", isAuth, clientController.getClients);

router.get("/:id", isAuth, clientController.getClientById);

// Update a client - Only Admins can update clients
// PUT http://localhost:5000/client/:id
router.put(
  "/:id",
  isAuth,
  role("admin"),
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Invalid email address."),
    body("phone").notEmpty().withMessage("Phone number is required."),
  ],
  clientController.updateClient
);

// Delete a client - Only Admins can delete clients
// DELETE http://localhost:5000/client/:id
router.delete("/:id", role("admin"), clientController.deleteClient);

module.exports = router;
