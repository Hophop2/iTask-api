const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");
// const verifyJWT = require("../middleware/verifyJWT");
// router.use(verifyJWT);
router.route("/").get(weatherController.getWeatherData);

router.route("/search").get(weatherController.getSearchWeatherData);

module.exports = router;
