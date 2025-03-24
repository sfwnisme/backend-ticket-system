const express = require('express');
const router = express.Router();
const controllers = require('../controllers/user.controllers')

router.route('/')
  .get(controllers.getAllUsers)

module.exports = router