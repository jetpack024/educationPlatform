const { Router } = require('express');
const User = require('../models/user');
const auth = require('../middelware/auth'); // аутентификация пользователя

const router = Router();

router
  .get('/', auth, async (req, res) => {
    const { user } = req;
    console.log(user);
    res.render('user', { user });
  })
  .get('/edit', auth, async (req, res) => {
    const { user } = req.session;
    res.render('user-edit', { user });
  })
  .post('/edit', auth, async (req, res) => {
    // try {
    const { user } = req.session;
    const mongoUser = await User.findOne({ _id: user._id });
    const {
      name,
      lastName,
      middleName,
      address,
      childFirstName,
      childMiddleName,
      childLastName,
      DateOfBirth,
    } = req.body;
    mongoUser.name = name;
    mongoUser.lastName = lastName;
    mongoUser.middleName = middleName;
    mongoUser.address = address;
    const child = {
      childFirstName, childMiddleName, childLastName, DateOfBirth,
    };
    mongoUser.children = child;
    mongoUser.isSuperUser = true;
    req.session.isSuperUser = true;
    console.log('mongoUser', mongoUser);
    await mongoUser.save();

    res.redirect('/user');
    // } catch (e) {
    //   console.log(e);
    // }
  });

module.exports = router;
