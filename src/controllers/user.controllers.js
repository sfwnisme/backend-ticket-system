const User = require('../models/user.model')


const getAllUsers = async (req, res) => {
  try {
    console.log('controller working ---------------')
    const allUsers = await User.find()
    console.log('hi', allUsers)
    return res.status(200).json(allUsers)
  } catch (error) {
    console.error('users error', error.message)
  }
}

module.exports = {
  getAllUsers
}