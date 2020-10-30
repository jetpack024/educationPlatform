const { Router } = require('express');
const Order = require('../models/order');
const auth = require('../middelware/auth'); //аутентификация пользователя

const router = Router();

// Роут для рендера заказов аутентифицированного пользователя ('/orders')
router.get('/', auth, async (req, res) => {

console.log(req.user);


  
  // try {
  //   const orders = await Order.find({ 'user.userId': req.user._id })
  //     .populate('user.userId');

  //   res.render('orders', {
  //     isOrder: true,
  //     title: 'Заказы',
  //     orders: orders.map((el) => ({
  //       ...el._doc,
  //     })),
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
  res.render('orders', {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phoneNumber: req.user.phoneNumber,
  })
});

// Роут для отправки заказа аутентифицированного пользователя в БД и редирект на (/orders)
router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate();

    const courses = user.cart.items.map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
