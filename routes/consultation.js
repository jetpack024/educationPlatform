const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/', async (req, res) => {
  res.render('consultation');
});

router.get('/confirm', async (req, res) => {
  const { user } = req.session;
  const mongoUser = await User.findOne({ _id: user._id });
  mongoUser.consultationRequest = true;
  await mongoUser.save();
  console.log(mongoUser);
  res.render('consultation-confirmed');
});

module.exports = router;
