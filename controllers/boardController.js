const { Board } = require("../models/Board");
const User = require("../models/User");

const asyncHandler = require("express-async-handler");

const createBoard = asyncHandler(async (req, res) => {
  const { userId, title } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const board = new Board({ title, user: userId });
  await board.save();

  res.status(201).json(board);
});

const getAllUserBoards = asyncHandler(async (req, res) => {
  const userId = req.id;

  const boards = await Board.find({ user: userId }).lean().exec();

  if (!boards?.length) {
    return res.status(400).json({ message: "No boards found" });
  }

  res.json(boards);
});

const getSpecificUserBoard = asyncHandler(async (req, res) => {
  const userId = req.id;
  const boardId = req.params.boardId;

  const board = await Board.findOne({ _id: boardId, user: userId })
    .lean()
    .exec();

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  res.json(board);
});

const updateBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;

  const board = await Board.findById(boardId);

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  board.title = title || board.title;
  await board.save();

  res.json(board);
});

const deleteBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const board = await Board.findById(boardId);

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  const user = await User.findById(board.user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.boards = user.boards.filter((b) => b.toString() !== boardId);
  await user.save();
  await board.remove();

  res.json({ message: "Board deleted successfully" });
});

module.exports = {
  createBoard,
  getAllUserBoards,
  getSpecificUserBoard,
  updateBoard,
  deleteBoard,
};
