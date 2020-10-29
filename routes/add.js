const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middelware/auth');

const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавть курс',
    isAdd: true,
  });
});

router.post('/', auth, async (req, res) => {
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
    await course.save();
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
