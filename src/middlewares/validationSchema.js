const { body } = require("express-validator")

const registerValidation = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage("name should not be empty")
      .isLength({ min: 3, max: 8 })
      .withMessage('charachters should be 3 to 8'),
    body('email')
      .notEmpty()
      .withMessage('email should not be empty')
      .isEmail()
      .withMessage('should be a valid email'),
    body('password')
      .notEmpty()
      .withMessage('password should not be empty')
  ]
}

const loginValidation = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('email should not be empty')
      .isEmail()
      .withMessage('should be a valid email'),
    body('password')
      .notEmpty()
      .withMessage('password should not be empty')
  ]
}

const updateUserValidation = () => {
  return [
    body('name')
      .isLength({ min: 3, max: 8 })
      .withMessage('charachters should be 3 to 8'),
    body('email')
      .isEmail()
      .withMessage('should be a valid email')
  ]
}

module.exports = { registerValidation, loginValidation, updateUserValidation }