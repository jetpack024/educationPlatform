const { Schema, model } = require('mongoose');

const childSchema = new Schema({
  childFirstName: {
    type: String,
    required: true
  },
  childLastName: {
    type: String,
    required: true
  },
  childMiddleName: {
    type: String,
    required: true
  },
  DateOfBirth: {
    type: Date,
  },
});
module.exports = model('Child', childSchema);
