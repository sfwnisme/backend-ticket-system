const statusText = require("../config/statusText.config")
const AppError = require("../utils/appError")
const appError = new AppError()

module.exports = (...roles) => {
  console.log('authorizedRole.js', roles)
  return (req, res, next) => {
    try {
      const { user } = req.body
      if (!roles.includes(user.role)) {
        appError.create(403, statusText.ERROR, 'Forbedden, you can not access this route')
        return next(appError)
      }
      console.log('access accepted')
      return next()
    } catch (error) {
      appError.create(400, statusText.ERROR, error.message)
      return next(appError)
    }
  }
}