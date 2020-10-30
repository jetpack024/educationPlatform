const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
  });
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = password === candidate.password;

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.isAdmin = candidate.isAdmin;
        console.log(req.session.isAdmin);
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect('/');
        });
      } else {
        res.redirect('/auth/login#login');
      }
    } else {
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    const {
      email, password, repeat, phoneNumber, name,
    } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      res.redirect('/auth/login#register');
    } else {
      const user = new User({
        email, name, password, phoneNumber, cart: { items: [] },
      });
      res.render('auth/confirm', { user });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/confirm', async (req, res) => {
  const {
    name, email, password, phoneNumber,
  } = req.body;
  const user = new User({
    email, name, password, phoneNumber,
  });
  await user.save();
  res.redirect('/auth/login#login');
});

module.exports = router;
