const { SUCCESS, ERROR } = require('../config/statusText.config')

const formatApiResponse = (
  status = 500,
  statusText = ERROR,
  msg = 'internal server error',
  data = null
) => {
  if (statusText !== SUCCESS) {
    return { status, statusText, msg, error: data }
  }
  return { status, statusText, msg, data }
}

module.exports = { formatApiResponse }

// const formatApiResponse = (
//   status = 500,
//   statusText = ERROR,
//   msg = 'internal server error',
//   data = null
// ) => {
//   if (statusText !== SUCCESS) {
//     return { status, statusText, msg, error: data }
//   }
//   return { status, statusText, msg, data }
// }