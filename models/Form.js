const mongoose = require('mongoose');

const FormSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorid: {
    type: String,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  usersAnswered: {
    type: Array
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
})

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;