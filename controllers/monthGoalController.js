const MonthGoal = require("../models/MonthGoal");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getAllMonthGoals = asyncHandler(async (req, res) => {
  const userId = req.id;

  const goals = await MonthGoal.find({ user: userId }).lean();

  if (!goals?.length) {
    return res.status(400).json({ message: "No month goals found" });
  }

  res.json(goals);
});

const createMonthGoal = asyncHandler(async (req, res) => {
  const goals = req.body.goals;

  if (!goals || !Array.isArray(goals) || goals.length === 0) {
    return res.status(400).json({ message: "No goals found in the request" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const goalTitles = new Set();

    for (const goal of goals) {
      const { user, title, completed } = goal;

      if (goalTitles.has(title)) {
        session.endSession();
        return res
          .status(400)
          .json({ message: "Duplicate goal title in the request" });
      }

      goalTitles.add(title);

      const duplicate = await MonthGoal.findOne({ user: user, title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

      if (duplicate) {
        session.endSession();
        return res.status(409).json({ message: "Duplicate monthGoal title" });
      }

      await MonthGoal.create([{ user: user, title, completed }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "New MonthGoals created" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Internal server error" });
  }
});

const updateMonthGoal = asyncHandler(async (req, res) => {
  const goalsToUpdate = Object.values(req.body);
  console.log(goalsToUpdate);

  if (
    !goalsToUpdate ||
    !Array.isArray(goalsToUpdate) ||
    goalsToUpdate.length === 0
  ) {
    return res.status(400).json({ message: "No goals found in the request" });
  }

  const updatedGoals = [];

  for (const goal of goalsToUpdate) {
    const { _id, title, completed } = goal;

    if (!_id) {
      return res
        .status(400)
        .json({ message: "Goal ID is required for updating" });
    }

    const existingGoal = await MonthGoal.findById(_id).exec();

    if (!existingGoal) {
      return res
        .status(404)
        .json({ message: `Goal with ID "${_id}" not found` });
    }

    existingGoal.title = title;
    existingGoal.completed = completed;

    const updatedGoal = await existingGoal.save();

    if (!updatedGoal) {
      return res
        .status(500)
        .json({ message: `Failed to update the goal with ID "${_id}"` });
    }

    updatedGoals.push(updatedGoal);
  }

  return res
    .status(200)
    .json({ message: "MonthGoals updated successfully", updatedGoals });
});

const deleteMonthGoal = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Month goal ID required" });
  }

  const goal = await MonthGoal.findById(id).exec();

  if (!goal) {
    return res.status(400).json({ message: "Month goal not found" });
  }

  const result = await goal.deleteOne();

  const reply = `Month goal '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllMonthGoals,
  createMonthGoal,
  updateMonthGoal,
  deleteMonthGoal,
};
