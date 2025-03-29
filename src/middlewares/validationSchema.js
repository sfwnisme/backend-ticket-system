const { body, param } = require("express-validator")
const { userRoles } = require("../config/userRoles.config")

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
    param('id')
      .optional()
      .isMongoId()
      .withMessage('ID is not valid mongodb ObjectId'),
    body('name')
      .optional()
      .isLength({ min: 3, max: 8 })
      .withMessage('charachters should be 3 to 8'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('should be a valid email'),
    body('role')
      .optional()
      .isIn(Object.values(userRoles))
      .withMessage(`available roles: ${Object.values(userRoles)}`)
  ]
}

module.exports = { registerValidation, loginValidation, updateUserValidation }