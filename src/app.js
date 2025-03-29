// -------------------------------
// Application setup
// -------------------------------

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config')

// load standards
const app = express();
dotenv.config();
connectDB()


// Middlewares
app.use(express.json());// parses JSON requests
app.use(cors());


// import routes
const userRoutes = require('./routes/user.routes');
const response = require('./utils/response');
const statusText = require('./config/statusText.config');
app.use('/api/users', userRoutes)

// -------------------------------
// Error Handling
// -------------------------------
app.all('*', (req, res, next) => {
  res.status(404).json(
    response(
      404,
      statusText.ERROR,
      'page not found',
      'the page you are trying to access is not found'
    ))
})

app.use((error, req, res, next) => {
  console.log('🟥🟥🟥🟥🟥🟥🟥global error ', error.message)
  return res.status(error.statusCode || 500).json(
    response(
      error.statusCode || 500,
      error.statusText,
      error.message,
      null
    ))
})

module.exports = app