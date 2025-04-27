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
const ticketRoutes = require('./routes/ticket.routes');
const commentRoutes = require('./routes/comment.routes');
const tagRoutes = require('./routes/tag.routes');

// import response handlers
const { formatApiResponse } = require('./utils/response');
const statusText = require('./config/statusText.config');
app.use('/api/users', userRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/tags', tagRoutes)

// -------------------------------
// Error Handling
// -------------------------------
app.all('*', (req, res, next) => {
  res.status(404).json(
    formatApiResponse(
      404,
      statusText.ERROR,
      'page not found',
      'the page you are trying to access is not found'
    ))
})

app.use((error, req, res, next) => {
  console.log('🟥global error ', error.message)
  return res.status(error.statusCode || 500).json(
    formatApiResponse(
      error.statusCode || 500,
      error.statusText,
      error.message,
      null
    ))
})

module.exports = app