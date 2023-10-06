const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdTask: {
    type: Number,
    default: 0,
  },
  deletedTask: {
    type: Number,
    default: 0,
  },
});

const UserStats = mongoose.model("UserStats", userStatsSchema);

module.exports = UserStats;
