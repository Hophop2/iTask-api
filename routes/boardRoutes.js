const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const taskController = require("../controllers/taskController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(boardController.getAllUserBoards)
  .post(boardController.createBoard)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

router.route("/:boardId").get(taskController.getAllUserTasks);

module.exports = router;
