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
const userRoutes = require('./routes/user.routes')
app.use('/api/users', userRoutes)


module.exports = app