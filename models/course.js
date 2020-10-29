const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  shortDescription: String,
  fullDescription: String,
  pictureLink: String,
  contentLink: String,
  contentType: String,
});

courseSchema.method('toClient', function () {
  const course = this.toObject();

  course.id = course._id;
  delete course._id;

  return course;
});

module.exports = model('Course', courseSchema);
