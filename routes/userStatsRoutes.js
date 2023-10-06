const express = require("express");
const router = express.Router();
const userStatsController = require("../controllers/userStatsController");
const verifyJWT = require("../middleware/verifyJWT");
router.use(verifyJWT);
router.route("/").get(userStatsController.getUserStats);

module.exports = router;
