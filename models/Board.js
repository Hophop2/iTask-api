const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new mongoose.Schema({
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Normal", "High"],
    default: "Normal",
  },
  subtasks: [subtaskSchema],
});

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Task = mongoose.model("Task", taskSchema);
const Board = mongoose.model("Board", boardSchema);

module.exports = {
  Task: Task,
  Board: Board,
};
