const mongoose = require('mongoose');
const { isHexColor } = require('validator');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    validate: {
      validator: (v) => isHexColor(v),
      message: props => `${props.value} is not a valid hex color`
    },
    default: '#6c757d'
  },
},
  {
    timestamps: true
  }
);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;