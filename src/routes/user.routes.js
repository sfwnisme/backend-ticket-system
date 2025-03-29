const express = require('express');
const router = express.Router();
const controllers = require('../controllers/user.controllers');
const { query, body } = require('express-validator');
const { registerValidation, loginValidation , updateUserValidation} = require('../middlewares/validationSchema');

router.route('/')
  .get(controllers.getAllUsers)
  // delete many users
  .delete(controllers.deleteUsers)

router.route('/register')
  .post(registerValidation(), controllers.register)

router.route('/login')
  .post(loginValidation(), controllers.login)

router.route('/:userId')
  .get(controllers.getSingleUser)
  .patch(updateUserValidation(),controllers.updateUser)
  .delete(controllers.deleteUser)

module.exports = router