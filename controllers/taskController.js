const { Task, Board } = require("../models/Board");
const asyncHandler = require("express-async-handler");
const UserStats = require("../models/UserStats");

const createNewTask = asyncHandler(async (req, res) => {
  const { boardId, title, context, date, priority, subtasks, status } =
    req.body;

  const board = await Board.findById(boardId);

  if (!board) {
    return res.status(400).json({ message: "Board not found" });
  }
  if (!subtasks) {
    return res.status(400).json({ message: "Subtasks does not exist" });
  }

  const task = new Task({
    title,
    context,
    date,
    board: boardId,
    priority,
    subtasks: subtasks.map((subtaskItem) => ({
      title: subtaskItem.title,
      completed: subtaskItem.completed || false,
    })),
    status,
  });
  await task.save();

  const userId = req.id;

  let userStats = await UserStats.findOne({ user: userId });

  if (!userStats) {
    userStats = new UserStats({ user: userId, createdTask: 0, deletedTask: 0 });
  }
  userStats.createdTask += 1;
  await userStats.save();

  res.status(201).json(task);
});

const getAllUserTasks = asyncHandler(async (req, res) => {
  const boardId = req.params.boardId;

  const tasks = await Task.find({ board: boardId }).lean();

  if (!tasks) {
    return res.status(404).json({ message: "Tasks not found" });
  }

  res.json(tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await Task.findOne({ _id: taskId }).lean();

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

const getUrgentTasks = async (req, res) => {
  try {
    const userId = req.id;

    const boards = await Board.find({ user: userId }).exec();

    const boardIds = boards.map((board) => board._id);

    const tasks = await Task.find({
      board: { $in: boardIds },
      priority: "High",
    }).exec();

    const tasksWithBoardName = tasks.map((task) => {
      const matchingBoard = boards.find((board) =>
        board._id.equals(task.board)
      );
      return {
        ...task.toObject(),
        boardName: matchingBoard ? matchingBoard.title : "Unknown Board",
      };
    });

    res.status(200).json(tasksWithBoardName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

const updateTask = asyncHandler(async (req, res) => {
  const { subtasks, taskId, title, context, date, status, priority } =
    req.body.updatedTask;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(400).json({ message: "Task not found" });
  }

  task.subtasks = subtasks || task.subtasks;
  task.context = context || task.context;
  task.title = title || task.title;
  task.priority = priority || task.priority;
  task.date = date || task.date;
  task.status = status || task.status;

  const updatedTask = await task.save();

  res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const task = await Task.findById(id).exec();

  if (!task) {
    return res.status(400).json({ message: "Task not found" });
  }

  await task.deleteOne();

  const userId = req.id;

  let userStats = await UserStats.findOne({ user: userId });

  if (!userStats) {
    userStats = new UserStats({ user: userId, createdTask: 0, deletedTask: 0 });
  }
  userStats.deletedTask += 1;
  await userStats.save();

  res.json({ message: "Task deleted successfully" });
});

module.exports = {
  createNewTask,
  updateTask,
  deleteTask,
  getTaskById,
  getUrgentTasks,
  getAllUserTasks,
};
