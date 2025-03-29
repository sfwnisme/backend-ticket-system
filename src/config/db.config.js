// -------------------------------
// database configuration
// -------------------------------

const mongoose = require('mongoose');

const dbName = "ticket-system-db"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName })
    console.log('🟩db connected')
  } catch (error) {
    console.error('🟥 MongoDB Connection Failed', error.message)
  }
}

module.exports = connectDB