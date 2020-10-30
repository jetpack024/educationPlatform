const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middelware/auth');

const router = Router();

// Роут на страницу (/courses) подгрузки найденных в БД курсов и отрисовки этих курсов из (courses.hbs) 
router.get('/', async (req, res) => {
  const courses = await Course.find()
    .populate('userId', 'email name')

    .select('price title img shortDescription');


  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses,
  });
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  const course = await Course.findById(req.params.id);

  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course,
  });
});

router.post('/edit', auth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
    contentType: req.body.contentType,
    shortDescription: req.body.shortDescription,
    fullDescription: req.body.fullDescription,
    pictureLink: req.body.pictureLink,
    contentLink: (req.body.contentLink.split('=')[1]),
  });
  try {
    await Course.deleteOne({ _id: req.body.id });
    await course.save();
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    layout: 'main',
    title: `Курс ${course.title}`,
    course,
  });
});

module.exports = router;
