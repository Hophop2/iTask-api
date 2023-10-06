const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router
  .route("/")
  .get(userController.getUserById)
  .post(userController.createUser)
  .delete(userController.deleteUser);

module.exports = router;
