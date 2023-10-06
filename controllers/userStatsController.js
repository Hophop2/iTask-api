const { Task, Board } = require("../models/Board");
const asyncHandler = require("express-async-handler");
const UserStats = require("../models/UserStats");

const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.id;

  try {
    const userBoards = await Board.find({ user: userId }).lean();
    const userStats = await UserStats.findOne({ user: userId });
    const boardIds = userBoards.map((board) => board._id);

    const doneTaskCount = await Task.countDocuments({
      board: { $in: boardIds },
      status: "Done",
    });

    const toDoTaskCount = await Task.countDocuments({
      board: { $in: boardIds },
      status: "To Do",
    });

    const inProgressTaskCount = await Task.countDocuments({
      board: { $in: boardIds },
      status: "In Progress",
    });
    const taskCounts = {
      doneTaskCount: doneTaskCount || 0,
      toDoTaskCount: toDoTaskCount || 0,
      inProgressTaskCount: inProgressTaskCount || 0,
    };
    const response = {
      taskCounts: taskCounts,
      userStats: userStats || { createdTask: 0, deletedTask: 0 },
    };

    res.json(response);
  } catch (error) {
    console.error("Błąd podczas liczenia zadań 'Done':", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
});

module.exports = { getUserStats };
