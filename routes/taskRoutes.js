const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .post(taskController.createNewTask)
  .get(taskController.getUrgentTasks);

router
  .route("/:taskId")
  .get(taskController.getTaskById)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
