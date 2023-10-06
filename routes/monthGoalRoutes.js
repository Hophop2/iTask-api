const express = require('express')
const router = express.Router()
const monthGoalController = require('../controllers/monthGoalController')
const verifyJWT = require('../middleware/verifyJWT')
router.use(verifyJWT)


router.route('/')
    .get( monthGoalController.getAllMonthGoals)
    .post(monthGoalController.createMonthGoal)
    .patch(monthGoalController.updateMonthGoal)
    .delete(monthGoalController.deleteMonthGoal)

module.exports = router