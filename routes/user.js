const { Router } = require('express');
const User = require('../models/user');
const Child = require('../models/child');
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
  })
  .post('/addChild', async (req, res) => {
    const {
      childFirstName, childLastName, childMiddleName, DateOfBirth,
    } = req.body;
    const child = new Child({
      childFirstName, childLastName, childMiddleName, DateOfBirth,
    });
    await child.save();
    const parent = req.session.user;
    const user = await User.findOne({ _id: parent._id });
    user.children.push(child);
    await user.save();
    res.render('user', { user });
  })
  .get('/addChild', async (req, res) => {
    res.render('child-edit');
  });

module.exports = router;
