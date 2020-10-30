const { Router } = require('express');
const User = require('../models/user');
const auth = require('../middelware/auth'); // аутентификация пользователя

const router = Router();

router
  .get('/', auth, async (req, res) => {
    res.render('user', {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
    });
  })
  .get('/edit', auth, async (req, res) => {
    const { user } = req.session;
    res.render('user-edit', { user });
  });

// router.post('/', auth, async (req, res) => {
//   try {
//     const {} = req.body;

//     res.redirect('/orders');
//   } catch (e) {
//     console.log(e);
//   }
// });

module.exports = router;
