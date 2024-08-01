const express = require('express')
const UserController = require('../controller/user')
const router = express.Router()


//signup new user
router.post('/signup', UserController.Signup)

//uprade plan
router.patch('/upgrade/:_id', UserController.Upgrade)

module.exports = router