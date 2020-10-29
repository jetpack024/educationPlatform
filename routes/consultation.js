const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/', async (req, res) => {
  res.render('consultation');
})
  .get('/confirm', async (req, res) => {
    const { user } = req.session;
    const mongoUser = await User.findOne({ _id: user._id });
    mongoUser.consultationRequest = true;
    await mongoUser.save();
    res.render('consultation-confirmed');
  })
  .get('/requests', async (req, res) => {
    const users = await User.find({ consultationRequest: true });
    res.render('consultation-requests', { users });
  });

module.exports = router;
