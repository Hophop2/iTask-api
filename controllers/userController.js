const User = require("../models/User");
const { Board, Task } = require("../models/Board");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const createUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const user = await User.create({ username, password: hashedPwd, email });

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password").lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.body.id;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await User.findByIdAndRemove(userId, { session });

    await Board.deleteMany({ user: userId }, { session });

    await Task.deleteMany(
      {
        board: {
          $in: (
            await Board.find({ user: userId }).select("_id").exec()
          ).map((board) => board._id),
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    console.log("User and their associated data have been deleted.");
  } catch (error) {
    console.error(
      "Error while deleting the user and their associated data:",
      error
    );
    session.abortTransaction();
    session.endSession();
  }
});

module.exports = { createUser, getUserById, deleteUser };
