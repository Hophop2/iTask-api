const mongoose = require("mongoose");

const monthGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const MonthGoal = mongoose.model("MonthGoal", monthGoalSchema);

module.exports = MonthGoal;
