const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  pictureUrl: {
    type: String,
    required: true
  },

  forms: [String],
  
  questionsAnswered: {
    type: Array
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;